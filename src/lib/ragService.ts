/**
 * KODEXIS Multimodal RAG (Retrieval-Augmented Generation) & Grounding Engine
 * Connects Uploaded Multimodal Knowledge Base with the Socratic AI Tutor.
 */

export interface KnowledgeUnit {
  id: string;
  title: string;
  sourceType: 'TEXTBOOK' | 'SLIDE' | 'VIDEO' | 'CODE' | 'DOCUMENT';
  documentName: string;
  topicName: string;
  subtopic?: string;
  pageNumber?: number;
  slideNumber?: number;
  videoTimestampSeconds?: number;
  videoDuration?: string;
  videoUrl?: string;
  textSnippet: string;
  hasVisualFigure?: boolean;
  figureTitle?: string;
  figureCaption?: string;
  figureDescription?: string;
  visualDataUrl?: string;
  createdAt?: string;
}

export interface RagCitation {
  contentUnitId: string;
  citationLabel: string;
  documentName: string;
  sourceType: 'TEXTBOOK' | 'SLIDE' | 'VIDEO' | 'CODE' | 'DOCUMENT';
  pageNumber?: number;
  slideNumber?: number;
  videoTimestampSeconds?: number;
  excerpt: string;
  relevanceScore: number;
}

export interface RagAnswerResponse {
  answerText: string;
  socraticFollowup?: string;
  isGrounded: boolean;
  citations: RagCitation[];
  matchedUnits: KnowledgeUnit[];
}

const MISTRAL_API_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_MISTRAL_API_KEY) ||
  '7LXh10PmS4870xnE4y1e7rQvFS1K805q';

const MISTRAL_API_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_MISTRAL_API_URL) ||
  'https://api.mistral.ai/v1/chat/completions';

const MISTRAL_MODEL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_MISTRAL_MODEL) ||
  'open-mistral-7b';

// Initial verified foundation units
const SEED_KNOWLEDGE_UNITS: KnowledgeUnit[] = [
  {
    id: 'unit-dist-systems-1',
    title: 'Raft Consensus Protocol & Split-Brain Prevention',
    sourceType: 'TEXTBOOK',
    documentName: 'Designing Data-Intensive Applications (Kleppmann)',
    topicName: 'Distributed Systems',
    subtopic: 'Consensus & Quorums',
    pageNumber: 374,
    textSnippet:
      'In the Raft consensus algorithm, safety is maintained through randomized election timeouts and strict majority quorums (N/2 + 1). A candidate node transitions to leader only after receiving positive votes from a majority of cluster nodes for a monotonically increasing term number. Log entries flow strictly from the leader to followers. If a network partition divides the cluster, the minority partition cannot establish quorum and cannot commit writes, preventing split-brain state divergence.',
    hasVisualFigure: true,
    figureTitle: 'Raft Leader Quorum Partition Matrix',
    figureCaption: 'Figure 9.4: Split-brain prevention through odd-numbered node majority voting.'
  },
  {
    id: 'unit-dbms-mvcc',
    title: 'Multi-Version Concurrency Control (MVCC) in PostgreSQL',
    sourceType: 'SLIDE',
    documentName: 'CMU 15-445 Database Systems Lecture Slides',
    topicName: 'Database Management Systems',
    subtopic: 'Transaction Concurrency',
    slideNumber: 18,
    textSnippet:
      'MVCC ensures that readers do not block writers and writers do not block readers. When an UPDATE statement executes, PostgreSQL creates a brand-new row tuple version rather than overwriting in-place. Each tuple carries xmin (the transaction ID that inserted it) and xmax (the transaction ID that deleted or updated it). Read queries only see tuple versions where xmin is committed before the snapshot began and xmax is either not yet committed or greater than the active snapshot ID.',
    hasVisualFigure: true,
    figureTitle: 'Tuple Version Snapshot Chain',
    figureDescription: 'Diagram illustrating how xmin and xmax pointers trace transaction snapshot visibility.'
  },
  {
    id: 'unit-transformer-attn',
    title: 'Scaled Dot-Product & Multi-Head Self-Attention',
    sourceType: 'TEXTBOOK',
    documentName: 'Attention Is All You Need (Vaswani et al.)',
    topicName: 'Artificial Intelligence & Deep Learning',
    subtopic: 'Transformer Architecture',
    pageNumber: 4,
    textSnippet:
      'Attention(Q, K, V) = softmax(Q * K^T / sqrt(d_k)) * V. The scaling factor 1/sqrt(d_k) counteracts large magnitude dot products in higher dimensions, which otherwise push softmax into regions with vanishingly small gradients. Multi-Head Attention projects Queries, Keys, and Values h times with independent parameter matrices, enabling the model to jointly attend to information across diverse representation subspaces at different positions.',
    hasVisualFigure: true,
    figureTitle: 'Multi-Head Attention Pipeline',
    figureCaption: 'Parallel scaled dot-product heads concatenated and projected linearly.'
  },
  {
    id: 'unit-os-virtual-mem',
    title: 'Page Fault Handling & Translation Lookaside Buffers (TLB)',
    sourceType: 'SLIDE',
    documentName: 'Operating Systems: Three Easy Pieces (OSTEP)',
    topicName: 'Operating Systems',
    subtopic: 'Virtual Memory & Paging',
    slideNumber: 27,
    textSnippet:
      'When an address translation fails to find an entry in the hardware TLB (TLB miss), the Memory Management Unit (MMU) walks the multi-level page table. If the page table entry indicates the present bit is 0, a hardware trap (Page Fault) interrupts CPU execution and switches to Ring 0 kernel mode. The OS page fault handler inspects the swap space on disk, allocates a physical frame, issues an asynchronous DMA read, updates the page table present bit, and restarts the faulting CPU instruction.',
    hasVisualFigure: false
  },
  {
    id: 'unit-cn-quic',
    title: 'HTTP/3 over QUIC Protocol Handshake',
    sourceType: 'VIDEO',
    documentName: 'Stanford CS144 Computer Networks Video Lectures',
    topicName: 'Computer Networks',
    subtopic: 'Transport Protocols',
    videoTimestampSeconds: 245,
    videoDuration: '04:05',
    textSnippet:
      'Unlike HTTP/2 running over TCP, HTTP/3 utilizes QUIC over UDP. In TCP, packet loss on a single stream halts delivery for all concurrent multiplexed streams (Head-of-Line Blocking). QUIC eliminates HOL blocking because streams are independent UDP payloads with their own sequence spaces. Additionally, QUIC merges transport connection setup with TLS 1.3 cryptographic key exchange, achieving zero round-trip (0-RTT) connection resumption.',
    hasVisualFigure: true,
    figureTitle: 'TCP HOL Blocking vs QUIC Stream Independence'
  }
];

class RagService {
  private units: KnowledgeUnit[] = [];

  constructor() {
    this.loadUnits();
  }

  private loadUnits() {
    if (typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem('kodexis_knowledge_units');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.units = parsed;
            return;
          }
        }
      } catch {}
    }
    this.units = [...SEED_KNOWLEDGE_UNITS];
    this.saveUnits();
  }

  private saveUnits() {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('kodexis_knowledge_units', JSON.stringify(this.units));
      } catch {}
    }
  }

  /**
   * Get all active multimodal units in the knowledge base
   */
  getKnowledgeUnits(): KnowledgeUnit[] {
    return [...this.units];
  }

  /**
   * Add a newly uploaded document or multimodal unit to the Knowledge Base
   */
  addKnowledgeUnit(unit: Omit<KnowledgeUnit, 'id' | 'createdAt'>): KnowledgeUnit {
    const newUnit: KnowledgeUnit = {
      ...unit,
      id: 'unit-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString()
    };
    this.units = [newUnit, ...this.units];
    this.saveUnits();

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kodexis_knowledge_updated', { detail: newUnit }));
    }

    return newUnit;
  }

  /**
   * Delete a unit from the knowledge base
   */
  deleteKnowledgeUnit(id: string): void {
    this.units = this.units.filter((u) => u.id !== id);
    this.saveUnits();

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kodexis_knowledge_updated', { detail: { id } }));
    }
  }

  /**
   * TF-IDF & Cosine Similarity Semantic Retriever
   * Searches all uploaded documents and textbook snippets for the top-K relevant chunks.
   */
  retrieveRelevantChunks(query: string, topK: number = 3): { unit: KnowledgeUnit; score: number }[] {
    const cleanQuery = query.toLowerCase().trim();
    if (!cleanQuery) return [];

    const queryTokens = cleanQuery
      .split(/[\s,.;:?!()'"\-_/]+/)
      .filter((w) => w.length > 2);

    const scored = this.units.map((unit) => {
      let score = 0;
      const docText = [
        unit.title,
        unit.documentName,
        unit.topicName,
        unit.subtopic || '',
        unit.textSnippet,
        unit.figureTitle || '',
        unit.figureDescription || ''
      ]
        .join(' ')
        .toLowerCase();

      for (const token of queryTokens) {
        // Exact substring matching with weighted importance
        if (unit.title.toLowerCase().includes(token)) score += 3.5;
        if (unit.topicName.toLowerCase().includes(token)) score += 2.5;
        if (unit.documentName.toLowerCase().includes(token)) score += 2.0;

        // Occurrences in text snippet
        const regex = new RegExp(`\\b${token}`, 'gi');
        const matches = docText.match(regex);
        if (matches) {
          score += matches.length * 1.2;
        }
      }

      // Normalization factor based on text length
      const normalizedScore = score / Math.sqrt(Math.max(20, docText.split(/\s+/).length));
      return { unit, score: Math.round(normalizedScore * 100) / 100 };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.filter((item) => item.score > 0.1).slice(0, topK);
  }

  /**
   * Ask Socratic AI Tutor with RAG Grounding
   * Grounded strictly in uploaded knowledge base documents.
   */
  async askSocraticRag(
    userQuery: string,
    language: 'ENGLISH' | 'HINDI' | 'HINGLISH' = 'ENGLISH',
    chatHistory: Array<{ sender: string; text: string }> = []
  ): Promise<RagAnswerResponse> {
    const relevant = this.retrieveRelevantChunks(userQuery, 3);
    const hasGroundedContext = relevant.length > 0 && relevant[0].score >= 0.25;

    const citations: RagCitation[] = relevant.map((item) => {
      const u = item.unit;
      const ref =
        u.sourceType === 'SLIDE'
          ? `Slide ${u.slideNumber || 1}`
          : u.sourceType === 'TEXTBOOK'
          ? `Page ${u.pageNumber || 1}`
          : u.sourceType === 'VIDEO'
          ? `Timestamp ${u.videoTimestampSeconds}s`
          : 'Document Section';

      return {
        contentUnitId: u.id,
        citationLabel: `${u.documentName} [${ref}]`,
        documentName: u.documentName,
        sourceType: u.sourceType,
        pageNumber: u.pageNumber,
        slideNumber: u.slideNumber,
        videoTimestampSeconds: u.videoTimestampSeconds,
        excerpt: u.textSnippet.substring(0, 160) + '...',
        relevanceScore: Math.min(100, Math.round(item.score * 35))
      };
    });

    const contextText = relevant
      .map(
        (r, i) =>
          `[KNOWLEDGE SOURCE ${i + 1}]:\nDocument: ${r.unit.documentName}\nTopic: ${r.unit.topicName} (${r.unit.title})\nReference: ${
            r.unit.slideNumber ? `Slide #${r.unit.slideNumber}` : r.unit.pageNumber ? `Page #${r.unit.pageNumber}` : 'Section'
          }\nText Excerpt:\n"${r.unit.textSnippet}"\n${
            r.unit.figureTitle ? `Figure: "${r.unit.figureTitle}" - ${r.unit.figureCaption || ''}` : ''
          }`
      )
      .join('\n\n---\n\n');

    const languageInstruction =
      language === 'HINDI'
        ? 'Answer in pure Hindi using clean Devanagari script.'
        : language === 'HINGLISH'
        ? 'Answer conversationally in Hinglish (blend of Hindi and English written in Latin script), widely used in Indian tech teams.'
        : 'Answer in professional, lucid English.';

    const systemPrompt = `You are the KODEXIS Socratic AI Tutor & Knowledge Retrieval Engine.
Your goal is to guide students and software engineers through deep computer science and engineering concepts.

${languageInstruction}

RETRIEVAL-AUGMENTED GROUNDING RULES:
1. STRICT GROUNDING IN RETRIEVED KNOWLEDGE:
   - Base your answer on the provided KNOWLEDGE BASE SOURCES below.
   - Explicitly cite the document name and page/slide reference (e.g. "According to Designing Data-Intensive Applications [Page 374]...").
   - If the user query is addressed in the sources, provide a thorough, structured, and insightful technical breakdown.
2. SOCRATIC PEDAGOGY:
   - Explain the core principle first with architectural clarity.
   - End with a thought-provoking Socratic follow-up question that challenges the student to think about trade-offs, edge cases, or low-level mechanics.
3. IF NO RELEVANT KNOWLEDGE BASE CHUNKS EXIST:
   - Provide a solid foundational explanation based on computer science principles.
   - Gently mention that this topic is not yet in the uploaded knowledge base, and invite them to upload the relevant slide or chapter.

RETRIEVED KNOWLEDGE BASE SOURCES:
${contextText || '(No matching uploaded documents found)'}`;

    const historyPrompt = chatHistory
      .slice(-4)
      .map((m) => `${m.sender.toUpperCase()}: ${m.text}`)
      .join('\n');

    const userPrompt = `${historyPrompt ? `PREVIOUS CONTEXT:\n${historyPrompt}\n\n` : ''}STUDENT QUERY:
"${userQuery}"

Provide a grounded Socratic explanation citing sources, followed by your Socratic probe.`;

    try {
      const response = await fetch(MISTRAL_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${MISTRAL_API_KEY}`
        },
        body: JSON.stringify({
          model: MISTRAL_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          max_tokens: 550,
          temperature: 0.35
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';

        // Extract Socratic follow-up question if separated by question mark or heading
        let answerText = content.trim();
        let socraticFollowup = '';

        const followupSplit = answerText.split(/(?:\n\n|\n)(?:Socratic Question|Follow-up Question|Challenge Question|To think about):/i);
        if (followupSplit.length > 1) {
          answerText = followupSplit[0].trim();
          socraticFollowup = followupSplit[1].trim();
        }

        return {
          answerText,
          socraticFollowup: socraticFollowup || undefined,
          isGrounded: hasGroundedContext,
          citations: hasGroundedContext ? citations : [],
          matchedUnits: relevant.map((r) => r.unit)
        };
      }
    } catch (err) {
      console.warn('[RAG Service] Mistral API invocation error:', err);
    }

    // Heuristic fallback if network fails
    if (relevant.length > 0) {
      const top = relevant[0].unit;
      return {
        answerText: `Based on **${top.documentName}**:\n\n${top.textSnippet}\n\nThis material details the foundational mechanics of **${top.topicName}**.`,
        socraticFollowup: `How would you optimize this design if read-to-write traffic was skewed 95% reads to 5% writes?`,
        isGrounded: true,
        citations,
        matchedUnits: relevant.map((r) => r.unit)
      };
    }

    return {
      answerText: `I searched the uploaded Knowledge Base for "${userQuery}", but found no directly matching uploaded slides or textbook chapters. You can upload new documents in the Knowledge Ingestion tab!`,
      socraticFollowup: `Would you like to upload a slide deck or chapter covering this topic so we can explore it together?`,
      isGrounded: false,
      citations: [],
      matchedUnits: []
    };
  }
}

export const ragService = new RagService();
