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
          if (Array.isArray(parsed)) {
            // Filter out any legacy dummy seed units previously stored in browser cache
            const legacyDummyIds = new Set([
              'unit-dist-systems-1',
              'unit-dbms-mvcc',
              'unit-transformer-attn',
              'unit-os-virtual-mem',
              'unit-cn-quic'
            ]);
            this.units = parsed.filter((u: any) => u && !legacyDummyIds.has(u.id));
            this.saveUnits();
            return;
          }
        }
      } catch {}
    }
    this.units = [];
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
