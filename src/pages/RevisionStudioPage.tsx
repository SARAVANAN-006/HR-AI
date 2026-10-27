import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LEARNING_API_BASE } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { ragService } from '../lib/ragService';
import {
  RotateCw,
  Headphones,
  Calendar,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  FileDown,
  Download,
  Copy,
  Check,
  Printer,
  FileText,
  Zap
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';

interface Flashcard {
  id: string;
  topicName: string;
  conceptName: string;
  frontPrompt: string;
  backExplanation: string;
  keyFormulaOrCode: string;
  sourceCitation: string;
  intervalDays: number;
}

interface AudioBrief {
  id: string;
  topicName: string;
  title: string;
  durationFormatted: string;
  transcript: string;
  sourceCitation: string;
}

interface SlideSummary {
  topicName: string;
  title: string;
  sourceCitation: string;
  keyBulletPoints: string[];
  diagramCaption?: string;
  visualDataUrl?: string;
}

interface StudySchedule {
  examName: string;
  daysRemainingUntilExam: number;
  currentOverallMastery: number;
  projectedExamDayRetention: number;
  dailyPlans: Array<{
    dayNumber: number;
    dateString: string;
    focusTopic: string;
    focusTopicCategory: string;
    currentMastery: number;
    estimatedMinutes: number;
    recommendedFormat: string;
    highYieldConcepts: string[];
  }>;
  retentionCurve: Array<{
    day: number;
    baselineRetentionWithoutReview: number;
    optimizedRetentionWithSpacedReview: number;
  }>;
}

export interface RevisionSheet {
  title: string;
  category: string;
  summary: string;
  coreFormulas: string[];
  complexityTable: Array<{ operation: string; time: string; space: string; notes: string }>;
  edgeCasesAndTraps: string[];
  codeTemplate: string;
  markdownDoc: string;
}

// Built-in High-Yield Quick Revision Master Sheets
export const QUICK_REVISION_SHEETS: Record<string, RevisionSheet> = {
  'computer-networks': {
    title: 'Computer Networks: OSI/TCP-IP, QUIC, Congestion Control & DNS',
    category: 'Computer Networks (CN)',
    summary: 'Comprehensive networking architecture covering the 7-Layer OSI and 4-Layer TCP/IP models, TCP 3-way handshake, Tahoe/Reno congestion control, UDP vs TCP, HTTP/1.1 vs HTTP/2 vs HTTP/3 (QUIC), DNS hierarchical resolution, WebSockets, and TLS 1.3 security.',
    coreFormulas: [
      'Bandwidth-Delay Product (BDP) = Bandwidth (bps) * RTT (sec) (Buffer capacity needed to prevent pipeline stalls)',
      "Little's Law: L = lambda * W (Average packets in flight = Arrival rate * Average latency)",
      'TCP Throughput (Mathis Equation): Rate <= (MSS / RTT) * (1 / sqrt(p)) where p is packet loss rate',
      'DNS Resolution Flow: Client -> Local Resolver -> Root Server (.) -> TLD (.com) -> Authoritative Nameserver'
    ],
    complexityTable: [
      { operation: 'TCP 3-Way Handshake', time: '1.5 RTT', space: 'O(1)', notes: 'SYN -> SYN-ACK -> ACK connection establishment' },
      { operation: 'TLS 1.3 Handshake', time: '1 RTT (0-RTT resumption)', space: 'O(1)', notes: 'ECDH key exchange bundled in ClientHello' },
      { operation: 'HTTP/2 Multiplexing', time: 'Single TCP Conn', space: 'O(Streams)', notes: 'Stream interleaving; subject to TCP HOL blocking' },
      { operation: 'HTTP/3 QUIC Transfer', time: '0-1 RTT over UDP', space: 'O(Streams)', notes: 'Independent streams eliminate head-of-line blocking' }
    ],
    edgeCasesAndTraps: [
      'SYN Flood Attack: Backlog queue exhaustion mitigated by SYN Cookies (encoding connection state in initial sequence number).',
      'TIME_WAIT State: Enforces 2*MSL (Maximum Segment Lifetime, 60-120s) to absorb delayed duplicate packets before port reuse.',
      'Head-of-Line (HoL) Blocking: In HTTP/2, a single dropped TCP segment stalls all multiplexed streams; HTTP/3 QUIC over UDP resolves this.',
      'DNS Stale Caching & NXDOMAIN: Resolvers cache both positive (A/AAAA) and negative responses (NXDOMAIN via SOA minimum TTL).'
    ],
    codeTemplate: `// High-Throughput HTTP/2 Multiplexing Server (Node.js)
const http2 = require('http2');
const fs = require('fs');

const server = http2.createSecureServer({
  key: fs.readFileSync('server-key.pem'),
  cert: fs.readFileSync('server-cert.pem')
});

server.on('stream', (stream, headers) => {
  // Streams are multiplexed concurrently over a single TCP connection
  stream.respond({ ':status': 200, 'content-type': 'application/json' });
  stream.end(JSON.stringify({ protocol: 'HTTP/2', multiplexed: true }));
});

server.listen(8443);`,
    markdownDoc: `# KODEXIS QUICK REVISION NOTES
## Topic: Computer Networks (OSI, TCP/IP, QUIC, Congestion & DNS)
**Category:** Computer Networks (CN)  
**Audience:** High-Frequency Tech Interview & Exam Revision

---

### 1. Executive Summary & Architecture
Computer networks rely on layered abstractions to ensure reliable, ordered, and secure data delivery across heterogeneous global hardware.
- **OSI 7-Layer Model:** Physical -> Data Link -> Network (IP) -> Transport (TCP/UDP) -> Session -> Presentation -> Application.
- **TCP/IP 4-Layer Model:** Network Access -> Internet (IP) -> Transport (TCP/UDP) -> Application (HTTP, DNS, SSH).

### 2. Core Mathematical Formulas & Invariants
- **Bandwidth-Delay Product (BDP):** $\\text{BDP} = \\text{Bandwidth (bps)} \\times \\text{RTT (sec)}$  
  *Rule:* If the TCP Receive Window (rwnd) is smaller than BDP, the connection underutilizes available link capacity.
- **Mathis Formula for TCP Throughput:**  
  $\\text{Throughput} \\le \\frac{\\text{MSS}}{\\text{RTT}} \\times \\frac{1}{\\sqrt{p}}$  
  *(where $p$ is packet loss probability, MSS is Maximum Segment Size).*

### 3. Protocol Evolution: HTTP/1.1 vs HTTP/2 vs HTTP/3
| Protocol | Transport | Multiplexing | Head-of-Line Blocking | Handshake Latency |
| :--- | :--- | :--- | :--- | :--- |
| **HTTP/1.1** | TCP | No (Pipeline fragile) | Severe (at HTTP layer) | 1 RTT TCP + 1-2 RTT TLS |
| **HTTP/2** | TCP | Yes (Binary frames) | Partial (at TCP layer on packet loss) | 1 RTT TCP + 1 RTT TLS |
| **HTTP/3** | UDP (QUIC) | Yes (Native stream IDs) | **Zero (Streams independent)** | **0-1 RTT (Combined Crypto + Transport)** |

### 4. Edge Cases & Interview Traps
1. **TCP Fast Open (TFO):** Embeds crypto cookie in initial SYN payload to send application data on the first RTT.
2. **SYN Flood Protection:** Traditional socket servers allocate a TCB (Transmission Control Block) on SYN. With SYN Cookies, no server memory is allocated until client ACK arrives.
3. **WebSockets vs SSE vs Long Polling:** WebSockets provide full-duplex bi-directional communication over a single TCP connection after an HTTP 101 Switching Protocols upgrade.

---
*Generated by KODEXIS Targeted Revision Studio • Grounded Knowledge Engine*`
  },
  'artificial-intelligence': {
    title: 'Artificial Intelligence: Search, Attention, Transformers, RAG & Agents',
    category: 'Artificial Intelligence (AI)',
    summary: 'Modern AI architecture spanning classical heuristic search (A*, Minimax, Alpha-Beta pruning) to state-of-the-art Transformer foundations, Scaled Dot-Product Attention, Large Language Models (LLMs), RAG systems, and Autonomous Agents (ReAct).',
    coreFormulas: [
      'A* Heuristic Evaluation: f(n) = g(n) + h(n) where h(n) is admissible (h(n) <= h*(n)) and monotonic',
      'Scaled Dot-Product Attention: Attention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V',
      'Multi-Head Attention: MHA(Q,K,V) = Concat(head_1, ..., head_h) * W^O where head_i = Attention(Q*W_i^Q, K*W_i^K, V*W_i^V)',
      'RAG Semantic Similarity: cos(theta) = (u . v) / (||u|| * ||v||) for dense vector embeddings'
    ],
    complexityTable: [
      { operation: 'A* Search (Optimal Heuristic)', time: 'O(b * d)', space: 'O(b^d)', notes: 'b = branching factor, d = goal depth' },
      { operation: 'Minimax with Alpha-Beta', time: 'O(b^(d/2))', space: 'O(d)', notes: 'Prunes redundant branches when moves ordered well' },
      { operation: 'Standard Self-Attention', time: 'O(N^2 * d)', space: 'O(N^2)', notes: 'N = token length; quadratic memory cost' },
      { operation: 'HNSW Vector ANN Query', time: 'O(log N)', space: 'O(N * M)', notes: 'Hierarchical Navigable Small World vector search' }
    ],
    edgeCasesAndTraps: [
      'Attention Memory Quadratic Wall: Long contexts (32k/128k) cause massive KV-cache RAM usage; require FlashAttention-2 tiling or PagedAttention.',
      'Inadmissible Heuristic in A*: Overestimating remaining path cost sacrifices guaranteed shortest-path optimality.',
      'LLM Hallucination vs Grounded RAG: Language models generate statistically probable tokens without intrinsic truth checks. Remediate with grounded citations and chunk reranking.',
      'Temperature vs Top-P: Temperature scales logits before softmax (T=0 is greedy argmax); Top-P (nucleus sampling) restricts sampling to the cumulative probability mass.'
    ],
    codeTemplate: `# Scaled Dot-Product Attention in Python (NumPy / Conceptual)
import numpy as np

def scaled_dot_product_attention(Q, K, V, mask=None):
    """
    Q, K, V shapes: (seq_len, d_k)
    """
    d_k = Q.shape[-1]
    scores = np.matmul(Q, K.T) / np.sqrt(d_k)
    
    if mask is not None:
        scores = np.where(mask == 0, -1e9, scores)
        
    weights = np.exp(scores - np.max(scores, axis=-1, keepdims=True))
    weights /= np.sum(weights, axis=-1, keepdims=True)  # Softmax
    
    return np.matmul(weights, V), weights`,
    markdownDoc: `# KODEXIS QUICK REVISION NOTES
## Topic: Artificial Intelligence (Search, Transformers, Attention & RAG)
**Category:** Artificial Intelligence (AI)  
**Audience:** High-Frequency Tech Interview & Exam Revision

---

### 1. Executive Summary & Mental Model
Modern AI encompasses both deterministic problem-solving search algorithms (A*, Minimax) and probabilistic representation learning (Transformers, LLMs, RAG).

### 2. Core Theoretical Equations
- **A* Search Formula:** $f(n) = g(n) + h(n)$  
  - $g(n)$: Exact path cost from start node to current node $n$.
  - $h(n)$: Estimated cost from $n$ to goal. Must satisfy $h(n) \\le h^*(n)$ (Admissibility).
- **Scaled Dot-Product Attention:**  
  $\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right) V$  
  *Division by $\\sqrt{d_k}$ prevents dot products from growing excessively large, avoiding vanishing gradients in softmax.*

### 3. Modern AI Architecture Comparison
| Architecture | Best Used For | Time Complexity | Bottleneck / Trap |
| :--- | :--- | :--- | :--- |
| **A* Graph Search** | Route planning, games | $O(b^d)$ worst-case | High RAM usage in open set |
| **Transformer Decoder** | Autoregressive text generation | $O(N^2 \\cdot d)$ per layer | KV-cache growth with long sequences |
| **Dense RAG Pipeline** | Factually grounded Q&A | $O(\\log N)$ vector retrieval | Chunking boundary information loss |
| **ReAct AI Agent** | Multi-step tool orchestration | $O(\\text{turns} \\times \\text{LLM Call})$ | Tool hallucination and infinite loops |

---
*Generated by KODEXIS Targeted Revision Studio • Grounded Knowledge Engine*`
  },
  'machine-learning': {
    title: 'Machine Learning: Bias-Variance, Loss Functions, Regularization & Ensembles',
    category: 'Machine Learning (ML)',
    summary: 'Core machine learning theory covering Supervised vs Unsupervised learning, Bias-Variance tradeoff, Cost functions (MSE, Cross-Entropy), Regularization (L1 Lasso for feature selection vs L2 Ridge for weight shrinkage), Optimization (SGD, Adam), Ensemble methods (Random Forest bagging vs XGBoost boosting), and Evaluation metrics (Precision, Recall, F1, ROC-AUC).',
    coreFormulas: [
      'Bias-Variance Decomposition: Expected Error = Bias^2 + Variance + Irreducible Noise (sigma^2)',
      'L1 Regularization (Lasso): Loss = Loss_0 + lambda * sum(|w_i|) (Drives non-informative weights to strictly zero)',
      'L2 Regularization (Ridge): Loss = Loss_0 + (lambda / 2) * sum(w_i^2) (Shrinks weights smoothly toward zero)',
      'Binary Cross-Entropy: L = -(1/N) * sum(y * log(p) + (1 - y) * log(1 - p))',
      'F1-Score: 2 * (Precision * Recall) / (Precision + Recall) where Precision = TP / (TP + FP), Recall = TP / (TP + FN)'
    ],
    complexityTable: [
      { operation: 'Linear / Logistic Regression', time: 'O(N * d)', space: 'O(d)', notes: 'Gradient descent update per epoch' },
      { operation: 'Random Forest Training', time: 'O(M * N * d * log N)', space: 'O(M * Nodes)', notes: 'M parallel bagged decision trees' },
      { operation: 'XGBoost Gradient Boosting', time: 'O(M * d * N * log N)', space: 'O(Trees)', notes: 'Sequential fitting on loss pseudo-residuals' },
      { operation: 'K-Means Clustering', time: 'O(I * K * N * d)', space: 'O(K * d)', notes: 'I iterations until centroid convergence' }
    ],
    edgeCasesAndTraps: [
      'Data Leakage: Normalizing, imputing, or vectorizing before the train/test split leaks test set parameters into training.',
      'Class Imbalance Trap: Accuracy on highly skewed distributions (e.g. 99% negative) is completely deceptive; evaluate using PR-AUC and F1-score.',
      'Vanishing / Exploding Gradients: Deep non-linear architectures without LayerNorm or residual skip connections suffer exponential gradient decay.',
      'Overfitting Remediations: Increase training data, apply Dropout (0.2-0.5), introduce L2 weight decay, or prune decision trees.'
    ],
    codeTemplate: `# Logistic Regression Gradient Descent Step with L2 Regularization
import numpy as np

def train_step_l2(X, y, weights, bias, lr=0.01, l2_lambda=0.1):
    N = len(y)
    z = np.dot(X, weights) + bias
    p = 1 / (1 + np.exp(-np.clip(z, -250, 250)))  # Sigmoid
    
    # Gradients with L2 Ridge penalty
    dw = (1 / N) * np.dot(X.T, (p - y)) + (l2_lambda / N) * weights
    db = (1 / N) * np.sum(p - y)
    
    weights -= lr * dw
    bias -= lr * db
    return weights, bias`,
    markdownDoc: `# KODEXIS QUICK REVISION NOTES
## Topic: Machine Learning Foundations & Evaluation Metrics
**Category:** Machine Learning (ML)  
**Audience:** High-Frequency Tech Interview & Exam Revision

---

### 1. Executive Summary & Bias-Variance Tradeoff
$\\text{Total Expected Error} = \\text{Bias}^2 + \\text{Variance} + \\sigma^2$
- **High Bias (Underfitting):** Model is too simplistic (e.g. fitting linear line to polynomial data). Solution: Increase complexity, add polynomial features, reduce regularization.
- **High Variance (Overfitting):** Model memorizes training noise. Solution: Add regularization ($L_1/L_2$), collect more training samples, apply bagging.

### 2. Regularization Framework
- **$L_1$ Lasso Regularization:** Adds $\\lambda \\sum |w_i|$ penalty. Produces **sparse weight vectors**, functioning as automatic feature selection.
- **$L_2$ Ridge Regularization:** Adds $\\frac{\\lambda}{2} \\sum w_i^2$ penalty. Prevents individual weights from exploding without zeroing them out completely.

### 3. Classification Evaluation Matrix
- **Precision:** $\\frac{TP}{TP + FP}$ *(When model predicts positive, how often is it right? Critical for spam filters)*
- **Recall (Sensitivity):** $\\frac{TP}{TP + FN}$ *(What percentage of actual positives did we capture? Critical for disease screening)*
- **ROC-AUC vs PR-AUC:** Use ROC-AUC for balanced classes; use Precision-Recall AUC (PR-AUC) when classes are severely skewed.

---
*Generated by KODEXIS Targeted Revision Studio • Grounded Knowledge Engine*`
  },
  'oops-design-patterns': {
    title: 'OOP & Design Patterns: 4 Pillars, SOLID Principles & Gang of Four',
    category: 'Object-Oriented Programming (OOPS)',
    summary: 'Object-oriented engineering fundamentals: 4 Pillars (Encapsulation, Abstraction, Inheritance, Polymorphism), SOLID principles (Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion), and canonical Gang of Four (GoF) patterns (Singleton, Factory, Observer, Strategy, Adapter, Decorator).',
    coreFormulas: [
      'Single Responsibility Principle (SRP): A class should have one, and only one, reason to change.',
      'Open/Closed Principle (OCP): Software entities should be open for extension, but closed for modification.',
      'Liskov Substitution Principle (LSP): Subtypes must be substitutable for their base types without altering correctness.',
      'Interface Segregation (ISP): Clients should never be forced to depend on interfaces they do not use.',
      'Dependency Inversion (DIP): Depend upon abstractions (interfaces), not concrete implementations.'
    ],
    complexityTable: [
      { operation: 'Virtual Method Dispatch (vtable)', time: 'O(1)', space: '1 pointer / obj', notes: 'Constant-time array offset dereference' },
      { operation: 'Double-Checked Locking Singleton', time: 'O(1)', space: 'O(1)', notes: 'Volatile variable prevents CPU instruction reordering' },
      { operation: 'Observer Event Notification', time: 'O(N)', space: 'O(N)', notes: 'Linear broadcast to N registered subscribers' },
      { operation: 'Strategy Pattern Delegation', time: 'O(1)', space: 'O(1)', notes: 'Runtime algorithm swap via polymorphic interface' }
    ],
    edgeCasesAndTraps: [
      'Composition Over Inheritance: Deep inheritance chains (>3 levels) cause fragile base class bugs. Favor composition with interfaces.',
      'Broken Singleton in Multithreading: Naive singletons create duplicate instances if two threads enter simultaneously. Requires volatile and double-checked locking.',
      'LSP Violation: Throwing UnsupportedOperationException in a derived subclass method violates Liskov substitution.',
      'Tight Coupling: Instantiating concrete dependencies directly with `new` violates Dependency Inversion (DIP); use dependency injection.'
    ],
    codeTemplate: `// Thread-Safe Singleton & Strategy Pattern (TypeScript)
class DatabaseConnection {
  private static instance: DatabaseConnection | null = null;
  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }
}

// Strategy Pattern Interface
interface PaymentStrategy {
  pay(amount: number): boolean;
}

class StripeStrategy implements PaymentStrategy {
  pay(amount: number) { console.log(\`Charged $\${amount} via Stripe\`); return true; }
}

class PayPalStrategy implements PaymentStrategy {
  pay(amount: number) { console.log(\`Charged $\${amount} via PayPal\`); return true; }
}`,
    markdownDoc: `# KODEXIS QUICK REVISION NOTES
## Topic: Object-Oriented Programming (SOLID & GoF Patterns)
**Category:** Object-Oriented Programming (OOPS)  
**Audience:** High-Frequency Tech Interview & Exam Revision

---

### 1. The Four Pillars of OOP
1. **Encapsulation:** Bundling data and methods that operate on that data inside a class while restricting direct access to internal state.
2. **Abstraction:** Hiding complex implementation details and exposing only essential interfaces.
3. **Inheritance:** Enabling classes to acquire properties and behaviors of existing classes.
4. **Polymorphism:** Allowing objects of different types to be treated through a unified interface (via method overriding / dynamic dispatch).

### 2. SOLID Architectural Principles
- **S - Single Responsibility:** A class should have only one reason to change.
- **O - Open/Closed:** Open for extension, closed for modification (extend via inheritance/interfaces, avoid modifying tested production classes).
- **L - Liskov Substitution:** Derived classes must remain interchangeable with base classes without breaking correctness.
- **I - Interface Segregation:** Prefer multiple small, client-specific interfaces over one bulky monolithic interface.
- **D - Dependency Inversion:** High-level policy modules should not depend on low-level detail modules; both must depend on abstractions.

### 3. Canonical Gang of Four (GoF) Design Patterns
| Pattern | Type | Primary Intent |
| :--- | :--- | :--- |
| **Singleton** | Creational | Ensure exactly one instance exists with a global point of access. |
| **Factory Method** | Creational | Delegate instantiation logic to specialized subclasses. |
| **Observer** | Behavioral | One-to-many dependency where state changes automatically notify subscribers. |
| **Strategy** | Behavioral | Encapsulate interchangeable algorithms inside separate classes. |
| **Adapter** | Structural | Convert the interface of a class into another interface expected by clients. |
| **Decorator** | Structural | Attach additional responsibilities to an object dynamically without subclassing. |

---
*Generated by KODEXIS Targeted Revision Studio • Grounded Knowledge Engine*`
  },
  'data-structures': {
    title: 'Data Structures: Arrays, Trees, Heaps, Tries, Graphs & DSU',
    category: 'Data Structures (DS)',
    summary: 'Comprehensive algorithmic data structures reference: Dynamic Arrays, Singly/Doubly Linked Lists, Monotonic Stacks, Hash Tables & Collision Resolution, BST, Self-Balancing Trees (AVL, Red-Black), Binary Min/Max Heaps, Tries, Disjoint Set Union (DSU / Union-Find), and Graph traversals (BFS, DFS, Dijkstra).',
    coreFormulas: [
      'Amortized Array Doubling: Geometric resizing from N to 2N guarantees O(1) amortized insertion cost.',
      'Heap Indexing (0-indexed): Left Child = 2*i + 1, Right Child = 2*i + 2, Parent = floor((i - 1) / 2)',
      'DSU Inverse Ackermann Bound: alpha(N) <= 4 for all practical universe sizes N < 10^80; effectively O(1).',
      'Tree Edge Invariant: A connected undirected tree with V vertices contains exactly V - 1 edges and no cycles.'
    ],
    complexityTable: [
      { operation: 'Hash Table (Average)', time: 'O(1)', space: 'O(N)', notes: 'Worst-case O(N) if collisions degenerate to a linked list' },
      { operation: 'Red-Black / AVL Tree', time: 'O(log N)', space: 'O(N)', notes: 'Guaranteed balanced worst-case height' },
      { operation: 'Binary Heap Min/Max', time: 'O(log N)', space: 'O(N)', notes: 'O(1) peek, O(log N) insert/extract, O(N) build heap' },
      { operation: 'Trie Prefix Search (Word len L)', time: 'O(L)', space: 'O(SIGMA * L * N)', notes: 'Lookup time is independent of dictionary size' },
      { operation: 'Disjoint Set Union (DSU)', time: 'O(alpha(N)) ~ O(1)', space: 'O(N)', notes: 'Path compression + union-by-rank' },
      { operation: 'Dijkstra (with Min-Heap)', time: 'O((V + E) log V)', space: 'O(V + E)', notes: 'Shortest path on non-negative edge graphs' }
    ],
    edgeCasesAndTraps: [
      'Hash Collision Degradation: High collision rates without balanced bucket trees degrade O(1) lookups to O(N).',
      'BST Degeneration: Inserting pre-sorted items into an unaugmented BST results in an O(N) linked list.',
      'Integer Overflow in Binary Search: Always compute mid = low + (high - low) // 2 to prevent 32-bit integer overflow.',
      'Monotonic Stack Boundary Flush: In Histogram problems, push a sentinel 0 at the end to flush remaining elements.'
    ],
    codeTemplate: `# Disjoint Set Union (Union-Find) with Path Compression & Rank (Python)
class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # Path compression
        return self.parent[x]

    def union(self, x, y):
        root_x, root_y = self.find(x), self.find(y)
        if root_x == root_y:
            return False  # Already in same set
        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1
        return True`,
    markdownDoc: `# KODEXIS QUICK REVISION NOTES
## Topic: Essential Data Structures & Complexity Bounds
**Category:** Data Structures (DS)  
**Audience:** High-Frequency Tech Interview & Exam Revision

---

### 1. Algorithmic Complexity Cheatsheet
| Data Structure | Access | Search | Insertion | Deletion | Space |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Dynamic Array** | $O(1)$ | $O(N)$ | $O(1)$ amortized | $O(N)$ | $O(N)$ |
| **Hash Table** | N/A | $O(1)$ avg / $O(N)$ worst | $O(1)$ avg / $O(N)$ worst | $O(1)$ avg / $O(N)$ worst | $O(N)$ |
| **Balanced BST (AVL/Red-Black)** | $O(\\log N)$ | $O(\\log N)$ | $O(\\log N)$ | $O(\\log N)$ | $O(N)$ |
| **Binary Heap (Priority Queue)** | $O(1)$ peek | $O(N)$ | $O(\\log N)$ | $O(\\log N)$ extract | $O(N)$ |
| **Trie (Prefix Tree)** | N/A | $O(L)$ prefix | $O(L)$ word | $O(L)$ word | $O(\\Sigma \\cdot L \\cdot N)$ |
| **Disjoint Set Union (DSU)** | N/A | $O(\\alpha(N)) \\approx O(1)$ | $O(\\alpha(N)) \\approx O(1)$ | N/A | $O(N)$ |

### 2. Monotonic Stack & Queue Patterns
- **Next Greater Element:** Traverse from right to left, maintaining a strictly decreasing stack.
- **Sliding Window Maximum:** Maintain a monotonic decreasing deque storing array indices.
- **Largest Rectangle in Histogram:** Stack of increasing bar heights; pop and calculate area when current bar is shorter.

---
*Generated by KODEXIS Targeted Revision Studio • Grounded Knowledge Engine*`
  },
  'system-design': {
    title: 'System Design: Scalability, Caching, Sharding, Message Queues & Rate Limiting',
    category: 'System Design',
    summary: 'End-to-end distributed systems design principles: Horizontal vs Vertical scaling, Load Balancers (L4 vs L7, Consistent Hashing), Caching layers (Cache-Aside, Write-Through, Write-Back, Eviction policies: LRU, LFU), Database Sharding & Partitioning, Replication & CAP/PACELC trade-offs, Asynchronous Message Queues (Kafka partitioned logs vs RabbitMQ), Rate Limiting algorithms (Token Bucket, Leaky Bucket, Sliding Window Counter), and Global Unique ID generation (Twitter Snowflake).',
    coreFormulas: [
      'Consistent Hashing: Keys and nodes hash to a ring of 2^32 slots; virtual nodes prevent hot spots on node addition/removal.',
      'Token Bucket Rate Limiter: Tokens fill at rate r tokens/sec up to capacity B; incoming request consumes 1 token or is dropped (429).',
      'Twitter Snowflake ID (64-bit): 1-bit sign | 41-bit timestamp (ms) | 10-bit machine ID | 12-bit sequence (4096 IDs/ms/node)',
      'High Availability Nines: 99.9% (Three Nines) = 8.76 hrs downtime/yr; 99.99% (Four Nines) = 52.6 mins downtime/yr'
    ],
    complexityTable: [
      { operation: 'LRU Cache (HashMap + DLL)', time: 'O(1) get & put', space: 'O(Capacity)', notes: 'Constant-time node promotion and eviction' },
      { operation: 'Consistent Hash Lookup', time: 'O(log V)', space: 'O(V)', notes: 'Binary search over virtual nodes on ring' },
      { operation: 'Token Bucket Rate Check', time: 'O(1)', space: 'O(1) / client', notes: 'Single atomic Redis transaction or in-memory map' },
      { operation: 'Kafka Partition Append', time: 'O(1) sequential I/O', space: 'O(Retention)', notes: 'Zero-copy sendfile directly to network socket' }
    ],
    edgeCasesAndTraps: [
      'Cache Stampede (Thundering Herd): Concurrent cache miss causes hundreds of DB queries. Solved by Mutex lock or probabilistic early refresh (XFetch).',
      'Sharding Key Skew: Sharding by company_id or date causes hot shards. Use compound hash keys.',
      'Distributed Idempotency: Network retries cause duplicate payments/orders. Enforce an Idempotency-Key header stored in Redis with unique transaction status.',
      'Split-Brain in Distributed Clusters: Heartbeat loss between regions leads to two active masters writing conflicting data. Prevent via Quorum requirements (N/2 + 1).'
    ],
    codeTemplate: `# Complete LRU Cache with HashMap + Doubly Linked List (Python)
class Node:
    def __init__(self, key, val):
        self.key, self.val = key, val
        self.prev = self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = {}  # key -> Node
        self.head, self.tail = Node(0, 0), Node(0, 0)
        self.head.next, self.tail.prev = self.tail, self.head

    def _remove(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev

    def _insert(self, node):
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node

    def get(self, key: int) -> int:
        if key in self.cache:
            node = self.cache[key]
            self._remove(node)
            self._insert(node)
            return node.val
        return -1

    def put(self, key: int, val: int) -> None:
        if key in self.cache:
            self._remove(self.cache[key])
        node = Node(key, val)
        self.cache[key] = node
        self._insert(node)
        if len(self.cache) > self.cap:
            lru = self.tail.prev
            self._remove(lru)
            del self.cache[lru.key]`,
    markdownDoc: `# KODEXIS QUICK REVISION NOTES
## Topic: System Design & Distributed Architecture
**Category:** System Design  
**Audience:** High-Frequency Tech Interview & Exam Revision

---

### 1. Scalability Dimensions & Invariants
- **Horizontal vs Vertical:** Vertical scaling (bigger instance) hits hardware/cost ceilings; Horizontal scaling (adding machines) requires stateless services and distributed coordination.
- **CAP Theorem:** Under a network partition ($P$), a distributed data store must choose between Consistency ($C$) or Availability ($A$).
- **PACELC Theorem:** If Partition ($P$) choose ($A$ or $C$); Else ($E$) choose Latency ($L$) or Consistency ($C$).

### 2. Caching Strategies
1. **Cache-Aside (Lazy Loading):** Application queries cache; on miss, queries DB and populates cache. Resilience against cache failures.
2. **Write-Through:** Application writes to cache, which synchronously writes to DB before returning. High data consistency, higher write latency.
3. **Write-Back (Write-Behind):** Application writes to cache, which asynchronously flushes to DB in batches. Extreme write throughput, risk of data loss on cache crash.

### 3. Distributed Coordination & Messaging
| Technology | Architecture | Ordering Guarantees | Best Used For |
| :--- | :--- | :--- | :--- |
| **Apache Kafka** | Append-only partitioned commit log | Strict per-partition ordering | Event streaming, high-throughput audit replay |
| **RabbitMQ** | Smart broker, dumb consumer (AMQP) | FIFO queue ordering | Complex routing, task work queues |
| **Redis** | In-memory key-value | Single-threaded atomic ops | Fast caching, rate limiters, distributed locks |

---
*Generated by KODEXIS Targeted Revision Studio • Grounded Knowledge Engine*`
  },
  'distributed-systems': {
    title: 'Distributed Consensus & Fault Tolerance (Paxos, Raft, 2PC)',
    category: 'Distributed Systems',
    summary: 'Distributed consensus algorithms guarantee safe state machine replication across unreliable networks where node crashes and packet drops occur.',
    coreFormulas: [
      'Quorum Requirement: Q = floor(N / 2) + 1 (tolerates f = floor((N - 1) / 2) crash faults)',
      'CAP Theorem Invariant: Under network partition (P), Consistency (C) and Availability (A) are mutually exclusive.',
      'PACELC Theorem: If Partition (P), choose Availability (A) or Consistency (C); Else (E), choose Latency (L) or Consistency (C).'
    ],
    complexityTable: [
      { operation: 'Raft Normal Replication', time: '1 RTT', space: 'O(log entries)', notes: 'Leader broadcasts to majority quorum' },
      { operation: 'Raft Leader Election', time: '1-2 RTT', space: 'O(1)', notes: 'Randomized election timer (150-300ms)' },
      { operation: 'Two-Phase Commit (2PC)', time: '2 RTT', space: 'O(cohorts)', notes: 'Blocking if coordinator fails after PREPARE' }
    ],
    edgeCasesAndTraps: [
      'Split-Brain Risk: Never run clusters with even node counts without tie-breaker arbiter.',
      'Network Asymmetry: Server A can ping B, but B cannot ping A (handled via pre-vote phase in Raft).',
      'Coordinator Crash in 2PC: Cohorts that voted YES are blocked holding locks until coordinator recovers.'
    ],
    codeTemplate: `# Raft Leader Heartbeat & Quorum Check (Python Conceptual)
def append_entries_quorum(term, leader_id, entries):
    acks = 1  # Self vote
    for peer in cluster.peers:
        if peer.send_append_entries(term, leader_id, entries):
            acks += 1
            if acks > len(cluster.peers) // 2:
                commit_index = max(commit_index, entries[-1].index)
                return True
    return False`,
    markdownDoc: `# KODEXIS QUICK REVISION NOTES
## Topic: Distributed Consensus & Fault Tolerance (Paxos, Raft, 2PC)
**Category:** Distributed Systems  
**Audience:** High-Frequency Interview & Exam Revision

---

### 1. Executive Summary & Mental Model
Distributed consensus algorithms guarantee that a decentralized cluster of machines agrees upon an ordered sequence of state machine transitions, even when networks partition or leader nodes crash.

### 2. Fundamental Mathematical Formulas & Theorems
- **Quorum Requirement:** $Q = \\lfloor N / 2 \\rfloor + 1$ (tolerates $f = \\lfloor (N - 1) / 2 \\rfloor$ crash faults).
- **CAP Theorem:** In the presence of a network partition ($P$), a distributed system must sacrifice either Availability ($A$) or Consistency ($C$).
- **PACELC Theorem:** If Partition ($P$) choose ($A$ or $C$); Else ($E$) choose Latency ($L$) or Consistency ($C$).

### 3. Algorithmic Complexity Bounds
| Operation | Time Latency | Space Complexity | Notes |
| :--- | :--- | :--- | :--- |
| Normal Log Commit | 1 RTT | $O(\\text{entries})$ | Quorum commit |
| Leader Election | 1-2 RTT | $O(1)$ | Randomized timeouts |
| Two-Phase Commit | 2 RTT | $O(N)$ | Blocking on coordinator failure |

### 4. Edge Cases & Interview Traps
1. **Split-Vote Prevention:** Randomize heartbeat/election timeouts between 150ms and 300ms to break symmetry.
2. **2PC Blocking Problem:** Unlike Paxos/Raft, 2PC is not consensus—it is an atomic commit protocol where any single failure halts the entire transaction.
3. **Log Compaction:** Always apply snapshotting before memory exhaustion occurs.

---
*Generated by KODEXIS Targeted Revision Studio • Grounded Knowledge Engine*`
  },
  'databases': {
    title: 'Database Internals: MVCC, B+ Trees & Write-Ahead Logging',
    category: 'Database Systems',
    summary: 'Relational storage engines combine append-only write-ahead logging (WAL) for durability with multi-version concurrency control (MVCC) for non-blocking snapshot isolation.',
    coreFormulas: [
      'B+ Tree Height Bound: h <= ceil(log_B(N / 2)) where B is branching factor (fan-out)',
      'Snapshot Visibility: Row visible if xmin < Txn_ID and (xmax is NULL or xmax > Txn_ID)',
      'WAL Invariant: Log record must flush to non-volatile disk before dirty page write to data file'
    ],
    complexityTable: [
      { operation: 'B+ Tree Point Lookup', time: 'O(log_B N)', space: 'O(1)', notes: 'Typically 3-4 I/O operations for millions of rows' },
      { operation: 'B+ Tree Range Scan', time: 'O(log_B N + K)', space: 'O(K)', notes: 'Traverse sequential leaf node linked list' },
      { operation: 'LSM-Tree Write', time: 'O(1)', space: 'O(RAM MemTable)', notes: 'Appends to MemTable and disk WAL' }
    ],
    edgeCasesAndTraps: [
      'Write Skew in Snapshot Isolation: Two transactions read disjoint rows and update each other’s constraints.',
      'Phantom Reads: Range queries returning newly inserted rows (remediated via Serializable SSI or predicate locking).',
      'Table Bloat from Dead Tuples: In PostgreSQL, high update rates require aggressive autovacuum tuning to prevent index bloat.'
    ],
    codeTemplate: `-- PostgreSQL Transaction Snapshot Visibility Check
SELECT txid_current(), txid_current_snapshot();
-- Tuple header contains xmin (creating txn) and xmax (deleting/updating txn)
-- VACUUM FULL reclaims dead tuple storage space on disk`,
    markdownDoc: `# KODEXIS QUICK REVISION NOTES
## Topic: Database Internals (MVCC, B+ Trees & WAL)
**Category:** Database Systems  
**Audience:** High-Frequency Interview & Exam Revision

---

### 1. Executive Summary
Modern relational DBMS (PostgreSQL, MySQL InnoDB) optimize read and write concurrency using Multi-Version Concurrency Control (MVCC) and B+ Tree indexing, backed by Write-Ahead Logging (WAL) for ACID guarantees.

### 2. Core Architectural Invariants
- **Write-Ahead Logging (WAL):** A data block cannot be written to disk before the log record describing the update is safely flushed to non-volatile storage.
- **Snapshot Isolation Rule:** Readers never block writers, and writers never block readers.
- **B+ Tree Leaf Nodes:** All keys reside in leaf nodes, linked sequentially for $O(K)$ range query performance.

### 3. Complexity Trade-Offs
| Engine / Structure | Read Point | Range Scan | Write Throughput |
| :--- | :--- | :--- | :--- |
| **B+ Tree (InnoDB)** | $O(\\log_B N)$ | $O(\\log_B N + K)$ | Moderate (Random Disk I/O) |
| **LSM Tree (RocksDB)** | $O(\\log N)$ (Bloom filters) | $O(\\log N + K)$ | High (Sequential Append) |

---
*Generated by KODEXIS Targeted Revision Studio • Grounded Knowledge Engine*`
  },
  'dynamic-programming': {
    title: 'Dynamic Programming: Memoization, Tabulation & State Space',
    category: 'Algorithms & DSA',
    summary: 'Dynamic programming optimizes exponential recursive search spaces down to polynomial time by recognizing optimal substructure and caching overlapping subproblems.',
    coreFormulas: [
      'Time Complexity = (Number of Distinct States) * (Work per State Transition)',
      'Space Complexity = (Number of Distinct States) or O(1) with rolling array reduction',
      'Bellman Equation: DP(state) = min/max { DP(substate) + cost }'
    ],
    complexityTable: [
      { operation: '0/1 Knapsack', time: 'O(N * W)', space: 'O(W)', notes: 'Pseudo-polynomial; 1D rolling array optimization' },
      { operation: 'Longest Common Subsequence (LCS)', time: 'O(M * N)', space: 'O(min(M, N))', notes: 'Keep only two previous rows' },
      { operation: 'Coin Change (Min Coins)', time: 'O(N * Amount)', space: 'O(Amount)', notes: 'Unbounded knapsack transition' }
    ],
    edgeCasesAndTraps: [
      'Base Case Invariants: Ensure DP[0] or boundary states are explicitly initialized before looping.',
      'Reverse Iteration in 1D Knapsack: In 0/1 knapsack with 1D array, iterate capacity backwards from W to w[i] to prevent using the same item twice.',
      'Integer Overflow: Use 64-bit integers when counting paths (e.g., unique paths in large grids).'
    ],
    codeTemplate: `# 0/1 Knapsack Space-Optimized Template (Python)
def knapsack_01(weights, values, W):
    dp = [0] * (W + 1)
    for w, v in zip(weights, values):
        for cap in range(W, w - 1, -1):  # REVERSE loop prevents duplicate inclusion
            dp[cap] = max(dp[cap], dp[cap - w] + v)
    return dp[W]`,
    markdownDoc: `# KODEXIS QUICK REVISION NOTES
## Topic: Dynamic Programming Patterns & Complexity
**Category:** Algorithms & Data Structures  
**Audience:** High-Frequency Interview & Exam Revision

---

### 1. Fundamental Mental Model
Dynamic Programming is simply **recursion without repetition**.
1. **Optimal Substructure:** Optimal solution to problem contains optimal solutions to subproblems.
2. **Overlapping Subproblems:** The same subproblems are solved multiple times.

### 2. Time & Space Complexity Framework
$$\\text{Total Time} = (\\text{Number of Unique Subproblem States}) \\times (\\text{Time per State Transition})$$

### 3. Essential Patterns & Invariants
- **Top-Down (Memoization):** Start from target state, recurse downwards, cache in hash map or array.
- **Bottom-Up (Tabulation):** Start from base cases (0 or 1), iterate forward.
- **Rolling Space Optimization:** If state $i$ only depends on state $i - 1$, drop the 2D matrix to two 1D rows.

---
*Generated by KODEXIS Targeted Revision Studio • Grounded Knowledge Engine*`
  },
  'operating-systems': {
    title: 'Operating Systems: Virtual Memory, Paging & Kernel Mechanics',
    category: 'Operating Systems',
    summary: 'Virtual memory separates the logical address space from physical RAM via hardware MMU address translation, multi-level page tables, and demand-paging swap backing stores.',
    coreFormulas: [
      'Number of Pages = Virtual Address Space / Page Size (e.g. 2^32 / 2^12 = 2^20 pages)',
      'Effective Memory Access Time: EMAT = (TLB Hit Rate * TLB Time) + ((1 - Hit Rate) * (TLB Time + Memory Time))',
      'Thrashing Condition: Sum of working set sizes across active processes exceeds available physical RAM.'
    ],
    complexityTable: [
      { operation: 'TLB Hit Translation', time: '1 cycle (Hardware)', space: 'O(TLB entries)', notes: 'Direct fast hardware cache lookup' },
      { operation: '4-Level Page Walk (x86-64)', time: '4 RAM lookups', space: 'O(Pages)', notes: 'PML4 -> PDPT -> PD -> PT -> Frame' },
      { operation: 'Page Fault Service', time: '~5-10 ms (Disk I/O)', space: 'O(1 frame)', notes: 'Traps to kernel, reads swap, updates PTE' }
    ],
    edgeCasesAndTraps: [
      'TLB Invalidation on Context Switch: Switching CR3 register flushes user TLB entries unless ASID (Address Space ID) is supported.',
      'Internal vs External Fragmentation: Paging eliminates external fragmentation but incurs internal fragmentation on the final page.',
      'Copy-On-Write (COW) on fork(): Parent and child share read-only pages until one writes, triggering a page fault that clones the frame.'
    ],
    codeTemplate: `// Virtual Address Decomposition
uint64_t vpn = (virtual_address >> 12) & 0x1FFFFFFFFFFFF; // Page number
uint64_t offset = virtual_address & 0xFFF;                // 4 KB offset
uint64_t pfn = page_table_lookup(vpn);
uint64_t physical_address = (pfn << 12) | offset;`,
    markdownDoc: `# KODEXIS QUICK REVISION NOTES
## Topic: Operating Systems (Virtual Memory & Paging)
**Category:** Operating Systems  
**Audience:** High-Frequency Interview & Exam Revision

---

### 1. Executive Summary
Virtual memory decouples the programmer's view of memory from physical RAM. The Memory Management Unit (MMU) translates Virtual Page Numbers (VPN) to Physical Frame Numbers (PFN).

### 2. Core Equations
- **Virtual Page Count:** $\\frac{\\text{Address Space Size}}{\\text{Page Size}} = \\frac{2^{32}}{2^{12}} = 2^{20} = 1,048,576\\text{ pages}$
- **Effective Memory Access Time (EMAT):**  
  $\\text{EMAT} = h \\times t_{\\text{TLB}} + (1 - h) \\times (t_{\\text{TLB}} + t_{\\text{RAM}})$

### 3. Essential Memory Concepts
- **Translation Lookaside Buffer (TLB):** Fast associative cache for address translation.
- **Multi-Level Page Tables:** Saves memory by allocating lower-level tables only for active address regions.
- **Copy-On-Write:** \`fork()\` duplicates page tables with read-only flags instead of cloning gigabytes of physical RAM.

---
*Generated by KODEXIS Targeted Revision Studio • Grounded Knowledge Engine*`
  }
};


const DEFAULT_REVISION_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-cn-1',
    topicName: 'Computer Networks (CN)',
    conceptName: 'TCP 3-Way Handshake vs HTTP/3 QUIC',
    frontPrompt: 'Why does HTTP/3 switch to UDP (QUIC) and eliminate TCP Head-of-Line blocking?',
    backExplanation: 'In TCP (HTTP/2), all multiplexed streams share a single byte stream. If one packet drops, the OS halts all streams until retransmission. HTTP/3 over QUIC implements stream framing natively on UDP, meaning packet loss on stream A never blocks stream B.',
    keyFormulaOrCode: 'TCP 3-Way: SYN -> SYN-ACK -> ACK (1.5 RTT) | QUIC: 0-1 RTT connection & TLS 1.3 handshake',
    sourceCitation: 'RFC 9000 (QUIC) / Computer Networking Top-Down',
    intervalDays: 1
  },
  {
    id: 'fc-ai-1',
    topicName: 'Artificial Intelligence (AI)',
    conceptName: 'Scaled Dot-Product Attention Mechanism',
    frontPrompt: 'What is the mathematical formulation of Self-Attention, and why is the scaling factor sqrt(d_k) critical?',
    backExplanation: 'Attention calculates softmax(Q*K^T / sqrt(d_k)) * V. The scaling factor sqrt(d_k) prevents large dot-product values from pushing softmax into regions with vanishingly small gradients.',
    keyFormulaOrCode: 'Attention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V',
    sourceCitation: 'Vaswani et al. (Attention Is All You Need)',
    intervalDays: 2
  },
  {
    id: 'fc-ml-1',
    topicName: 'Machine Learning (ML)',
    conceptName: 'L1 Lasso vs L2 Ridge Regularization',
    frontPrompt: 'Why does L1 regularization drive weights strictly to zero while L2 regularization only shrinks them?',
    backExplanation: 'L1 has a diamond-shaped constraint with sharp corners on the coordinate axes where optimal level curves intersect. L2 has a circular/spherical constraint with smooth boundaries, shrinking weights quadratically without setting them strictly to zero.',
    keyFormulaOrCode: 'L1: Loss + lambda * sum(|w_i|) | L2: Loss + (lambda/2) * sum(w_i^2)',
    sourceCitation: 'Elements of Statistical Learning (Hastie et al.)',
    intervalDays: 3
  },
  {
    id: 'fc-oops-1',
    topicName: 'OOPS & Design Patterns',
    conceptName: 'Liskov Substitution Principle (LSP)',
    frontPrompt: 'State the Liskov Substitution Principle and give a classic violation example.',
    backExplanation: 'Subtypes must be substitutable for their base types without altering program correctness. Classic violation: Square inheriting from Rectangle. If setWidth(w) changes height to maintain square symmetry, client code expecting independent width and height fails.',
    keyFormulaOrCode: 'If S is a subtype of T, objects of type T may be replaced with objects of type S without breaking contracts.',
    sourceCitation: 'Clean Architecture (Robert C. Martin)',
    intervalDays: 2
  },
  {
    id: 'fc-ds-1',
    topicName: 'Data Structures (DS)',
    conceptName: 'Disjoint Set Union (DSU) Ackermann Complexity',
    frontPrompt: 'What makes Disjoint Set Union (DSU) with Path Compression and Union by Rank run in near constant time?',
    backExplanation: 'Path compression flattens the tree during find(), pointing nodes directly to root. Union by rank always attaches the shorter tree to the taller tree. Together, any sequence of M operations runs in O(M * alpha(N)) where alpha(N) is the inverse Ackermann function (<= 4 for all universe sizes).',
    keyFormulaOrCode: 'Time: O(alpha(N)) ~ O(1) per find/union operation',
    sourceCitation: 'Introduction to Algorithms (CLRS)',
    intervalDays: 4
  },
  {
    id: 'fc-sys-1',
    topicName: 'System Design',
    conceptName: 'Consistent Hashing with Virtual Nodes',
    frontPrompt: 'How does Consistent Hashing prevent massive cache reshuffling when adding or removing nodes?',
    backExplanation: 'Both nodes and keys hash to a circular integer ring [0, 2^32 - 1]. A key is assigned to the next clockwise node. When a node is added or removed, only keys in the adjacent interval are remapped (k/N keys on average). Virtual nodes ensure even load distribution across physical machines.',
    keyFormulaOrCode: 'Key remapping on node change: O(k / N) keys moved instead of O(k) with hash(key) % N',
    sourceCitation: 'Designing Data-Intensive Applications (Kleppmann)',
    intervalDays: 1
  }
];

const DEFAULT_AUDIO_BRIEFS: AudioBrief[] = [
  {
    id: 'ab-cn-1',
    topicName: 'Computer Networks (CN)',
    title: 'OSI 7-Layer, TCP 3-Way Handshake & QUIC Protocol',
    durationFormatted: '3 min 20 sec',
    transcript: 'Welcome to your Computer Networks audio brief. Today we review the core internet protocols. The 7-layer OSI model categorizes communication into Physical, Data Link, Network, Transport, Session, Presentation, and Application layers. In the transport layer, TCP provides reliable, ordered data delivery using a 3-way handshake: SYN, SYN-ACK, and ACK. Meanwhile, HTTP/3 replaces TCP with QUIC over UDP, completely eliminating Head of Line blocking and achieving zero-RTT connection resumption with integrated TLS 1.3 encryption.',
    sourceCitation: 'Kodexis Audio Syllabus • Computer Networks'
  },
  {
    id: 'ab-ai-1',
    topicName: 'Artificial Intelligence (AI)',
    title: 'Transformer Attention Mechanism & Retrieval-Augmented Generation',
    durationFormatted: '4 min 15 sec',
    transcript: 'Welcome to your Artificial Intelligence audio brief. In modern AI, the Transformer architecture replaced sequential RNNs by processing tokens in parallel. The scaled dot-product attention computes query-key matrix multiplication divided by the square root of key dimensions, followed by softmax and value multiplication. In Retrieval-Augmented Generation, vector embeddings allow dense semantic similarity search in vector databases like HNSW, grounding LLM outputs to eliminate hallucinations.',
    sourceCitation: 'Kodexis Audio Syllabus • Artificial Intelligence'
  },
  {
    id: 'ab-ml-1',
    topicName: 'Machine Learning (ML)',
    title: 'Regularization, Bias-Variance Tradeoff & Evaluation Metrics',
    durationFormatted: '3 min 45 sec',
    transcript: 'Welcome to your Machine Learning audio brief. Generalization error is governed by the bias-variance tradeoff. High bias causes underfitting, while high variance causes overfitting. Regularization stabilizes model weights: L1 Lasso adds an absolute weight penalty to enforce sparsity, while L2 Ridge adds a squared weight penalty to shrink weights smoothly. When evaluating imbalanced datasets, always prefer Precision-Recall AUC over deceptive raw accuracy.',
    sourceCitation: 'Kodexis Audio Syllabus • Machine Learning'
  },
  {
    id: 'ab-oops-1',
    topicName: 'OOPS & Design Patterns',
    title: 'SOLID Principles & Gang of Four Design Patterns',
    durationFormatted: '4 min 00 sec',
    transcript: 'Welcome to your Object-Oriented Programming audio brief. SOLID principles ensure scalable software design. Single Responsibility ensures classes have one reason to change. Open-Closed requires classes to be open for extension but closed for modification. Liskov Substitution mandates that derived classes safely substitute base classes. In design patterns, Singleton guarantees a single instance, Observer broadcasts state changes, and Strategy dynamically swaps algorithms at runtime.',
    sourceCitation: 'Kodexis Audio Syllabus • OOPS & Patterns'
  },
  {
    id: 'ab-ds-1',
    topicName: 'Data Structures (DS)',
    title: 'Trees, Heaps, Disjoint Set Union & Monotonic Stacks',
    durationFormatted: '3 min 50 sec',
    transcript: 'Welcome to your Data Structures audio brief. Efficient algorithmic performance depends on choosing the optimal data structure. Priority queues utilize binary min or max heaps to provide logarithmic insertion and extraction with O of 1 peek. Disjoint Set Union utilizes path compression and union by rank to achieve near constant amortized time. Monotonic stacks maintain strictly sorted order to solve next-greater element and histogram problems in linear time.',
    sourceCitation: 'Kodexis Audio Syllabus • Data Structures'
  },
  {
    id: 'ab-sys-1',
    topicName: 'System Design',
    title: 'High-Availability Architecture, Caching & Consistent Hashing',
    durationFormatted: '4 min 30 sec',
    transcript: 'Welcome to your System Design audio brief. High-scale distributed systems require fault tolerance and graceful degradation. Consistent hashing distributes traffic across a circular hash ring of 2 to the 32 slots using virtual nodes to prevent hot spots. Caching strategies like Cache-Aside, Write-Through, and Write-Back balance latency against consistency. To prevent cache stampedes, employ mutex locks and probabilistic early expiration.',
    sourceCitation: 'Kodexis Audio Syllabus • System Design'
  }
];

export const RevisionStudioPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'QUICK_NOTES' | 'FLASHCARDS' | 'AUDIO_BRIEFS' | 'SLIDE_SUMMARIES' | 'STUDY_SCHEDULE'>('QUICK_NOTES');
  
  // Quick Revision Notes State (Requirement 3)
  const [selectedTopicKey, setSelectedTopicKey] = useState<string>('distributed-systems');
  const [copiedNotice, setCopiedNotice] = useState<boolean>(false);
  const [knowledgeUnitsCount, setKnowledgeUnitsCount] = useState<number>(0);

  const [flashcards, setFlashcards] = useState<Flashcard[]>(DEFAULT_REVISION_FLASHCARDS);
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const [audioBriefs, setAudioBriefs] = useState<AudioBrief[]>(DEFAULT_AUDIO_BRIEFS);
  const [activeAudioIdx, setActiveAudioIdx] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const [slideSummaries, setSlideSummaries] = useState<SlideSummary[]>([]);
  const [schedule, setSchedule] = useState<StudySchedule | null>(null);

  const [examDays] = useState(14);
  const [examName] = useState('Distributed Systems & Algorithms Final Assessment');
  const { user } = useAuth();
  const activeUserId = user?.username || 'candidate';

  const API_BASE = LEARNING_API_BASE;

  useEffect(() => {
    fetchRevisionData();
    const units = ragService.getKnowledgeUnits();
    setKnowledgeUnitsCount(units.length);
  }, [activeUserId]);

  const fetchRevisionData = async () => {
    try {
      const [revRes, schedRes] = await Promise.allSettled([
        axios.get(`${API_BASE}/revision/material?userId=${encodeURIComponent(activeUserId)}`, { timeout: 2500 }),
        axios.get(`${API_BASE}/revision/schedule?userId=${encodeURIComponent(activeUserId)}&days=${examDays}&examName=${encodeURIComponent(examName)}`, { timeout: 2500 })
      ]);

      if (revRes.status === 'fulfilled' && revRes.value.data) {
        setFlashcards((revRes.value.data.flashcards && revRes.value.data.flashcards.length > 0) ? revRes.value.data.flashcards : DEFAULT_REVISION_FLASHCARDS);
        setAudioBriefs((revRes.value.data.audioBriefs && revRes.value.data.audioBriefs.length > 0) ? revRes.value.data.audioBriefs : DEFAULT_AUDIO_BRIEFS);
        setSlideSummaries(revRes.value.data.slideSummaries || []);
      }
      if (schedRes.status === 'fulfilled' && schedRes.value.data) {
        setSchedule(schedRes.value.data);
      }
    } catch {
      // Use built-in materials
    }
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentCardIdx((prev) => (prev + 1) % (flashcards.length || 1));
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCurrentCardIdx((prev) => (prev - 1 + (flashcards.length || 1)) % (flashcards.length || 1));
  };

  const handlePlayAudio = (brief: AudioBrief) => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(brief.transcript);
      utterance.rate = 1.05;
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const activeCard = flashcards[currentCardIdx];
  const currentSheet = QUICK_REVISION_SHEETS[selectedTopicKey] || QUICK_REVISION_SHEETS['distributed-systems'];

  // Download Quick Revision Notes as Markdown (.md)
  const handleDownloadMarkdown = () => {
    const element = document.createElement('a');
    const file = new Blob([currentSheet.markdownDoc], { type: 'text/markdown;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Kodexis_Revision_Notes_${selectedTopicKey}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Download Quick Revision Notes as Text (.txt)
  const handleDownloadText = () => {
    const textContent = `${currentSheet.title}\nCategory: ${currentSheet.category}\n\nSUMMARY:\n${currentSheet.summary}\n\nCORE FORMULAS:\n${currentSheet.coreFormulas.join('\n')}\n\nEDGE CASES & TRAPS:\n${currentSheet.edgeCasesAndTraps.join('\n')}\n\nCODE TEMPLATE:\n${currentSheet.codeTemplate}`;
    const element = document.createElement('a');
    const file = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Kodexis_Revision_Notes_${selectedTopicKey}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Copy Markdown to Clipboard
  const handleCopyMarkdown = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentSheet.markdownDoc);
      setCopiedNotice(true);
      setTimeout(() => setCopiedNotice(false), 2200);
    }
  };

  // Print Formatted Revision Sheet
  const handlePrintNotes = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 font-sans">
      {/* HEADER BANNER */}
      <div className="glass-panel p-6 rounded-2xl border border-brand-cyan/20 bg-gradient-to-r from-brand-cyan/5 via-transparent to-brand-violet/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-brand-cyan uppercase tracking-wider mb-1">
            <Sparkles size={14} />
            <span>Targeted Revision Studio & Downloadable Revision Notes</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-100 tracking-tight font-mono">
            Targeted Revision Studio & Spaced Mastery
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Generate and download <strong>high-yield Quick Revision Notes (.md, .txt)</strong>, spaced-repetition flashcards, and audio briefs calibrated to your weakest concepts{knowledgeUnitsCount > 0 ? ` and ${knowledgeUnitsCount} uploaded knowledge base units` : ''}.
          </p>
        </div>

        {/* REVISION MODALITY SELECTOR */}
        <div className="flex flex-wrap items-center gap-1.5 bg-background-panel border border-border p-1.5 rounded-xl shrink-0 font-mono">
          <button
            onClick={() => setActiveTab('QUICK_NOTES')}
            className={`px-3 py-2 rounded-lg text-xs transition flex items-center space-x-1.5 ${
              activeTab === 'QUICK_NOTES'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileDown size={14} />
            <span>Quick Notes</span>
          </button>

          <button
            onClick={() => setActiveTab('FLASHCARDS')}
            className={`px-3 py-2 rounded-lg text-xs transition flex items-center space-x-1.5 ${
              activeTab === 'FLASHCARDS'
                ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <RotateCw size={14} />
            <span>Flashcards</span>
          </button>

          <button
            onClick={() => setActiveTab('AUDIO_BRIEFS')}
            className={`px-3 py-2 rounded-lg text-xs transition flex items-center space-x-1.5 ${
              activeTab === 'AUDIO_BRIEFS'
                ? 'bg-brand-violet/20 text-brand-violet border border-brand-violet/40 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Headphones size={14} />
            <span>Audio Briefs</span>
          </button>

          <button
            onClick={() => setActiveTab('SLIDE_SUMMARIES')}
            className={`px-3 py-2 rounded-lg text-xs transition flex items-center space-x-1.5 ${
              activeTab === 'SLIDE_SUMMARIES'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers size={14} />
            <span>Slide Summaries</span>
          </button>

          <button
            onClick={() => setActiveTab('STUDY_SCHEDULE')}
            className={`px-3 py-2 rounded-lg text-xs transition flex items-center space-x-1.5 ${
              activeTab === 'STUDY_SCHEDULE'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Calendar size={14} />
            <span>Schedule</span>
          </button>
        </div>
      </div>

      {/* TAB 1: QUICK REVISION NOTES GENERATOR & DOWNLOADER (Requirement 3) */}
      {activeTab === 'QUICK_NOTES' && (
        <div className="space-y-6">
          {/* Topic Selector & Action Controls */}
          <div className="glass-panel p-5 rounded-2xl border border-border flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-xs text-zinc-400 font-bold uppercase shrink-0">Select Revision Domain:</span>
              <select
                value={selectedTopicKey}
                onChange={(e) => setSelectedTopicKey(e.target.value)}
                className="p-2.5 rounded-xl bg-zinc-900 border border-border text-cyan-300 text-xs font-bold focus:outline-none focus:border-cyan-500"
              >
                <optgroup label="Requested Core Concepts">
                  <option value="computer-networks">Computer Networks (CN: OSI, TCP/IP, QUIC, DNS)</option>
                  <option value="artificial-intelligence">Artificial Intelligence (AI: Search, Transformers, RAG)</option>
                  <option value="machine-learning">Machine Learning (ML: Regularization, Ensembles, Metrics)</option>
                  <option value="oops-design-patterns">OOPS & Design Patterns (SOLID, 4 Pillars, GoF)</option>
                  <option value="data-structures">Data Structures (DS: Heaps, Tries, Graphs, DSU)</option>
                  <option value="system-design">System Design (Scalability, Caching, Kafka, Rate Limiting)</option>
                </optgroup>
                <optgroup label="Deep-Dive Systems & Algorithms">
                  <option value="distributed-systems">Distributed Systems (Paxos, Raft, 2PC, Quorums)</option>
                  <option value="databases">Database Internals (MVCC, B+ Trees, WAL, ACID)</option>
                  <option value="dynamic-programming">Dynamic Programming (Patterns, Memoization, State Space)</option>
                  <option value="operating-systems">Operating Systems (Virtual Memory, Paging, TLB, COW)</option>
                </optgroup>
              </select>
            </div>

            {/* Download Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleDownloadMarkdown}
                className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                title="Download formatted Markdown notes file"
              >
                <Download size={13} />
                <span>Download Notes (.md)</span>
              </button>

              <button
                onClick={handleDownloadText}
                className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-border font-mono text-xs font-bold transition flex items-center gap-1.5"
                title="Download plain text notes file"
              >
                <FileText size={13} />
                <span>Text (.txt)</span>
              </button>

              <button
                onClick={handleCopyMarkdown}
                className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-border font-mono text-xs transition flex items-center gap-1.5"
                title="Copy Markdown content to clipboard"
              >
                {copiedNotice ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                <span>{copiedNotice ? 'Copied!' : 'Copy'}</span>
              </button>

              <button
                onClick={handlePrintNotes}
                className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 border border-border transition"
                title="Print or Save as PDF"
              >
                <Printer size={14} />
              </button>
            </div>
          </div>

          {/* Rendered Revision Sheet */}
          <div className="glass-panel p-6 md:p-8 rounded-2xl border border-cyan-500/25 bg-background-panel space-y-6">
            {/* Sheet Header */}
            <div className="border-b border-border/70 pb-4 flex flex-col md:flex-row md:items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1">
                  KODEXIS HIGH-YIELD REVISION SHEET • {currentSheet.category}
                </span>
                <h2 className="text-xl md:text-2xl font-bold font-mono text-zinc-100">
                  {currentSheet.title}
                </h2>
                <p className="text-xs text-zinc-400 mt-1 max-w-3xl leading-relaxed">
                  {currentSheet.summary}
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 shrink-0">
                Ready for Download
              </span>
            </div>

            {/* Core Formulas & Theoretical Invariants */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap size={14} /> Core Invariants & Mathematical Formulas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
                {currentSheet.coreFormulas.map((f, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-zinc-950/70 border border-cyan-500/20 text-zinc-300 leading-relaxed">
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Algorithmic Complexity Bounds Table */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
                Complexity Trade-offs & Bounds
              </h3>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-zinc-900 text-zinc-400 uppercase text-[10px] border-b border-border">
                    <tr>
                      <th className="p-3">Operation / Protocol</th>
                      <th className="p-3">Time / Latency</th>
                      <th className="p-3">Space Overhead</th>
                      <th className="p-3">Engineering Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-zinc-300 bg-zinc-950/40">
                    {currentSheet.complexityTable.map((row, idx) => (
                      <tr key={idx} className="hover:bg-zinc-900/40 transition">
                        <td className="p-3 font-bold text-zinc-200">{row.operation}</td>
                        <td className="p-3 text-cyan-300">{row.time}</td>
                        <td className="p-3 text-purple-300">{row.space}</td>
                        <td className="p-3 text-zinc-400 font-sans text-[11px]">{row.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Edge Cases & Common Bugs */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Edge Cases, Failure Modes & Interview Traps
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-sans">
                {currentSheet.edgeCasesAndTraps.map((c, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/30 text-zinc-300 leading-relaxed">
                    <span className="font-bold text-amber-400 block mb-1 font-mono">Trap #{idx + 1}</span>
                    {c}
                  </div>
                ))}
              </div>
            </div>

            {/* Canonical Code Template */}
            <div className="space-y-3 font-mono">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Canonical Code Snippet / Protocol Pattern
              </h3>
              <div className="p-4 rounded-xl bg-zinc-950 border border-border text-xs text-cyan-300 overflow-x-auto">
                <pre>{currentSheet.codeTemplate}</pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. FLASHCARDS STUDIO */}
      {activeTab === 'FLASHCARDS' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>WEAK TOPIC REVISION DECK</span>
            <span>CARD {flashcards.length > 0 ? currentCardIdx + 1 : 0} OF {flashcards.length}</span>
          </div>

          {flashcards.length > 0 && activeCard ? (
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="relative w-full min-h-[300px] p-8 rounded-2xl border border-brand-cyan/30 bg-background-panel cursor-pointer select-none transition-all flex flex-col justify-between shadow-[0_0_30px_rgba(34,211,238,0.1)]"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-4">
                  <span className="text-brand-cyan font-bold">{activeCard.topicName}</span>
                  <span className="text-zinc-500">Interval: {activeCard.intervalDays}d</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-zinc-100 mb-2">
                  {isFlipped ? activeCard.conceptName : activeCard.frontPrompt}
                </h3>
                {isFlipped && (
                  <div className="space-y-4 pt-2">
                    <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                      {activeCard.backExplanation}
                    </p>
                    {activeCard.keyFormulaOrCode && (
                      <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-brand-cyan">
                        <code>{activeCard.keyFormulaOrCode}</code>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-zinc-500 pt-6 border-t border-border/50">
                <span>{isFlipped ? 'CLICK TO FLIP TO FRONT' : 'CLICK TO REVEAL EXPLANATION'}</span>
                <span className="text-[11px] truncate max-w-xs">{activeCard.sourceCitation}</span>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-2xl border border-border text-center space-y-3 font-mono">
              <CheckCircle2 size={32} className="text-emerald-400 mx-auto" />
              <p className="text-sm text-zinc-300">All flashcard reviews up to date for today!</p>
              <button
                onClick={() => setActiveTab('QUICK_NOTES')}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-zinc-950 font-bold text-xs"
              >
                Explore Quick Revision Sheets
              </button>
            </div>
          )}

          {flashcards.length > 0 && (
            <div className="flex justify-between items-center font-mono">
              <button
                onClick={handlePrevCard}
                className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-xs flex items-center space-x-1 hover:bg-zinc-700"
              >
                <ChevronLeft size={16} />
                <span>PREVIOUS</span>
              </button>
              <button
                onClick={handleNextCard}
                className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-xs flex items-center space-x-1 hover:bg-zinc-700"
              >
                <span>NEXT</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. AUDIO BRIEFS */}
      {activeTab === 'AUDIO_BRIEFS' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="space-y-3">
            {audioBriefs.map((brief, idx) => {
              const isSelected = activeAudioIdx === idx;
              return (
                <div
                  key={brief.id || idx}
                  className={`p-4 rounded-xl border transition ${
                    isSelected ? 'bg-brand-violet/15 border-brand-violet' : 'bg-background-panel border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-brand-violet font-bold uppercase">{brief.topicName}</span>
                      <h4 className="text-sm font-bold text-zinc-200">{brief.title}</h4>
                      <p className="text-xs text-zinc-400 font-mono mt-0.5">{brief.durationFormatted} • {brief.sourceCitation}</p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveAudioIdx(idx);
                        handlePlayAudio(brief);
                      }}
                      className="p-3 rounded-full bg-brand-violet/20 text-brand-violet hover:bg-brand-violet hover:text-white transition"
                    >
                      <Headphones size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. SLIDE SUMMARIES */}
      {activeTab === 'SLIDE_SUMMARIES' && (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {slideSummaries.map((slide, idx) => (
            <div key={idx} className="glass-panel p-5 rounded-xl border border-border space-y-3">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">{slide.topicName}</span>
              <h4 className="text-sm font-bold text-zinc-200">{slide.title}</h4>
              <ul className="space-y-1.5 text-xs text-zinc-300 font-sans">
                {slide.keyBulletPoints.map((bp, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-brand-cyan">•</span>
                    <span>{bp}</span>
                  </li>
                ))}
              </ul>
              <span className="text-[10px] text-zinc-500 font-mono block pt-2">{slide.sourceCitation}</span>
            </div>
          ))}
        </div>
      )}

      {/* 5. STUDY SCHEDULE & FORGETTING CURVE */}
      {activeTab === 'STUDY_SCHEDULE' && schedule && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-border space-y-4">
            <h3 className="text-sm font-mono font-bold text-zinc-200">OPTIMIZED RETENTION TRAJECTORY (EBBINGHAUS SPACING)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={schedule.retentionCurve}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="day" stroke="#71717a" fontSize={11} />
                  <YAxis domain={[0, 100]} stroke="#71717a" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                  <Area type="monotone" dataKey="optimizedRetentionWithSpacedReview" name="With Spaced Review" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.15} />
                  <Area type="monotone" dataKey="baselineRetentionWithoutReview" name="Without Review" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.05} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
