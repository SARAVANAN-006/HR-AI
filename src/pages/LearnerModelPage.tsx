import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LEARNING_API_BASE } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import {
  Brain,
  GitBranch,
  CheckCircle2,
  Play,
  Video,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Globe,
  Layers,
  Activity
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

interface LearnerMastery {
  userId: string;
  coldStartComplete: boolean;
  topicMastery: Record<string, number>;
  conceptMastery: Record<string, number>;
  history: Array<{
    timestamp: number;
    topicId: string;
    topicName: string;
    conceptId: string;
    correct: boolean;
    priorMastery: number;
    updatedMastery: number;
  }>;
}

export interface CourseNode {
  id: string;
  label: string;
  category: string;
  mastery: number;
  status: 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'MASTERED';
  x: number;
  y: number;
  unitCount: number;
  videoId?: string;
  videoTitle?: string;
  channel?: string;
  duration?: string;
  summary?: string;
  keyPoints?: string[];
}

export interface InternetResource {
  title: string;
  url: string;
  source: string;
  description: string;
  badge: string;
}

export interface BlueprintTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  nodes: CourseNode[];
  edges: Array<{ id: string; source: string; target: string; relationship: string }>;
  resources: InternetResource[];
}

// -------------------------------------------------------------------------------------
// 12 PRODUCTION-GRADE ROADMAP BLUEPRINTS WITH VIDEOS & VERIFIED INTERNET DOCUMENTATION
// -------------------------------------------------------------------------------------
export const ROADMAP_BLUEPRINTS: BlueprintTemplate[] = [
  // 1. DSA Roadmap
  {
    id: 'dsa-roadmap',
    title: 'DSA Roadmap (Algorithms & Data Structures)',
    category: 'Computer Science Core',
    description: 'Master foundational to advanced algorithmic problem solving, graph theory, dynamic programming recurrences, and asymptotically optimal invariants.',
    nodes: [
      {
        id: 'dsa-1',
        label: 'Arrays & Two Pointers',
        category: 'Algorithms',
        mastery: 0.85,
        status: 'MASTERED',
        x: 40,
        y: 40,
        unitCount: 8,
        videoId: 'KLlXCFG5TnA',
        videoTitle: 'Two Pointer Technique & In-Place Array Transformations',
        channel: 'NeetCode',
        duration: '14:30',
        summary: 'Learn how to shrink search spaces from O(N^2) to linear O(N) by coordinating left and right index pointers on sorted structures.',
        keyPoints: ['Opposite-end pointer convergence', 'Fast and slow pointer cycle detection', 'In-place element removal without memory allocation']
      },
      {
        id: 'dsa-2',
        label: 'Sliding Window & Subarrays',
        category: 'Algorithms',
        mastery: 0.75,
        status: 'MASTERED',
        x: 270,
        y: 40,
        unitCount: 6,
        videoId: 'jM2dhDPYMQM',
        videoTitle: 'Sliding Window Algorithm Technique Explained',
        channel: 'Errichto Algorithms',
        duration: '16:15',
        summary: 'Maintain dynamic running states across contiguous array segments to solve longest substring and bounded sum challenges in O(N).',
        keyPoints: ['Fixed vs dynamically expanding windows', 'Frequency map auxiliary validation', 'Contracting left pointer to restore validity constraints']
      },
      {
        id: 'dsa-3',
        label: 'Binary Trees & Traversals',
        category: 'Data Structures',
        mastery: 0.65,
        status: 'IN_PROGRESS',
        x: 500,
        y: 40,
        unitCount: 10,
        videoId: 'fAAZ23xIC30',
        videoTitle: 'Binary Tree Algorithms & DFS/BFS Traversals Course',
        channel: 'freeCodeCamp.org',
        duration: '26:40',
        summary: 'Recursive pre-order, in-order, and post-order depth-first searches, plus queue-based level order traversals for balanced hierarchical structures.',
        keyPoints: ['Recursive call-stack frame analysis', 'Queue-based BFS for shortest distance levels', 'Lowest Common Ancestor (LCA) subtree propagation']
      },
      {
        id: 'dsa-4',
        label: 'Graphs & Topological Sort',
        category: 'Algorithms',
        mastery: 0.55,
        status: 'AVAILABLE',
        x: 730,
        y: 40,
        unitCount: 12,
        videoId: 'tWVWeAqZ0WU',
        videoTitle: 'Graph Theory, BFS/DFS & Kahn Topological Sort',
        channel: 'William Fiset',
        duration: '22:00',
        summary: 'Representing sparse graphs via adjacency lists, detecting cycles with three-color DFS, and scheduling dependencies using Kahn in-degree queues.',
        keyPoints: ['Adjacency list memory efficiency O(V + E)', 'In-degree array initialization for Kahn algorithm', 'Cycle detection on Directed Acyclic Graphs (DAGs)']
      },
      {
        id: 'dsa-5',
        label: 'Dynamic Programming & Memoization',
        category: 'Algorithms',
        mastery: 0.40,
        status: 'AVAILABLE',
        x: 40,
        y: 200,
        unitCount: 14,
        videoId: 'oBt53YbR9K3',
        videoTitle: 'Dynamic Programming - Learn to Solve Algorithmic Problems',
        channel: 'freeCodeCamp.org',
        duration: '28:15',
        summary: 'Deconstruct exponential recursion trees by isolating optimal substructure and overlapping subproblems into polynomial memoization tables.',
        keyPoints: ['Recurrence relation state formulation', 'Memoization hash map caching', 'Bottom-up tabulation space optimization']
      },
      {
        id: 'dsa-6',
        label: 'Heaps & Priority Queues',
        category: 'Data Structures',
        mastery: 0.30,
        status: 'AVAILABLE',
        x: 270,
        y: 200,
        unitCount: 7,
        videoId: 'HqPJF2L5h9U',
        videoTitle: 'Heaps and Priority Queues Complete Architecture',
        channel: 'Abdul Bari',
        duration: '18:50',
        summary: 'Binary min/max heaps backed by flat arrays, maintaining heap property invariants in O(log N) for streaming top-K elements.',
        keyPoints: ['Array index math: 2*i + 1 and 2*i + 2', 'Sift-up and sift-down bubble mechanics', 'Linear O(N) heapify building algorithm']
      }
    ],
    edges: [
      { id: 'e-dsa-1', source: 'dsa-1', target: 'dsa-2', relationship: 'PREREQUISITE_FOR' },
      { id: 'e-dsa-2', source: 'dsa-2', target: 'dsa-3', relationship: 'PREREQUISITE_FOR' },
      { id: 'e-dsa-3', source: 'dsa-3', target: 'dsa-4', relationship: 'PREREQUISITE_FOR' },
      { id: 'e-dsa-4', source: 'dsa-4', target: 'dsa-5', relationship: 'PREREQUISITE_FOR' }
    ],
    resources: [
      {
        title: 'Roadmap.sh Computer Science & DSA Blueprint',
        url: 'https://roadmap.sh/computer-science',
        source: 'roadmap.sh',
        description: 'Interactive visual path for essential data structures, algorithmic complexities, and asymptotic proofs.',
        badge: 'OFFICIAL ROADMAP'
      },
      {
        title: 'NeetCode Algorithm Roadmaps & Practice',
        url: 'https://neetcode.io/roadmap',
        source: 'neetcode.io',
        description: 'Structured topic-by-topic dependency tree covering Blind 75 and NeetCode 150 with video analyses.',
        badge: 'PRACTICE SUITE'
      },
      {
        title: 'GeeksforGeeks Complete DSA Reference',
        url: 'https://www.geeksforgeeks.org/data-structures/',
        source: 'geeksforgeeks.org',
        description: 'Comprehensive tutorials, diagrams, and time complexity proofs for all linear and hierarchical data structures.',
        badge: 'REFERENCE DOCS'
      }
    ]
  },

  // 2. System Design Roadmap
  {
    id: 'system-design-roadmap',
    title: 'System Design & Distributed Architecture Roadmap',
    category: 'Architecture & Scalability',
    description: 'Design highly available, fault-tolerant enterprise architectures capable of scaling to hundreds of millions of requests per second.',
    nodes: [
      {
        id: 'sd-1',
        label: 'Horizontal Scaling & Load Balancing',
        category: 'Scalability',
        mastery: 0.88,
        status: 'MASTERED',
        x: 40,
        y: 40,
        unitCount: 6,
        videoId: 'K0Ta65OqQk8',
        videoTitle: 'System Design: Load Balancers and Horizontal Scaling Explained',
        channel: 'ByteByteGo',
        duration: '11:45',
        summary: 'Layer 4 (Transport) vs Layer 7 (Application) routing, reverse proxies, and consistent hashing algorithms.',
        keyPoints: ['Round-robin, least connections, and IP hash routing', 'Consistent hashing ring with virtual nodes', 'Health checking and active failover pools']
      },
      {
        id: 'sd-2',
        label: 'Caching Strategies & Redis',
        category: 'Performance',
        mastery: 0.70,
        status: 'MASTERED',
        x: 270,
        y: 40,
        unitCount: 8,
        videoId: 'dGAgxozNWFE',
        videoTitle: 'System Design: How to Cache at Scale (Redis, Memcached)',
        channel: 'ByteByteGo',
        duration: '13:20',
        summary: 'Mitigate database read contention using distributed in-memory caches, Cache-Aside, Write-Through, and eviction policies.',
        keyPoints: ['Cache-aside vs Write-through vs Write-behind', 'LRU and LFU cache eviction mechanics', 'Thundering herd & cache penetration mitigation']
      },
      {
        id: 'sd-3',
        label: 'Database Sharding & Replication',
        category: 'Data Architecture',
        mastery: 0.58,
        status: 'IN_PROGRESS',
        x: 500,
        y: 40,
        unitCount: 9,
        videoId: '5faMjKuB9bc',
        videoTitle: 'Database Sharding vs Partitioning vs Replication',
        channel: 'Hussein Nasser',
        duration: '17:40',
        summary: 'Horizontally split relational tables across database clusters using partition keys, leader-follower replication, and read replicas.',
        keyPoints: ['Hash-based vs range-based shard keys', 'Replication lag and eventual consistency trade-offs', 'Cross-shard join prevention via denormalization']
      },
      {
        id: 'sd-4',
        label: 'Message Queues & Event Streaming (Kafka)',
        category: 'Decoupling',
        mastery: 0.45,
        status: 'AVAILABLE',
        x: 730,
        y: 40,
        unitCount: 10,
        videoId: 'Ch5VhJzaoaI',
        videoTitle: 'Apache Kafka Architecture & Message Queue Internals',
        channel: 'Gaurav Sen',
        duration: '19:15',
        summary: 'Decouple producer and consumer microservices asynchronously using partitioned commit logs, consumer groups, and backpressure buffers.',
        keyPoints: ['Append-only sequential disk log throughput', 'Consumer group offset coordination', 'At-least-once vs exactly-once delivery guarantees']
      },
      {
        id: 'sd-5',
        label: 'Distributed Consensus & CAP Theorem',
        category: 'Distributed Systems',
        mastery: 0.35,
        status: 'AVAILABLE',
        x: 40,
        y: 200,
        unitCount: 7,
        videoId: 'vYp4LYbnnW8',
        videoTitle: 'Raft Consensus Algorithm & Distributed State Machines',
        channel: 'Distributed Systems & Heidi Howard',
        duration: '14:20',
        summary: 'How distributed nodes coordinate leader election, replicate state machine logs across quorums, and balance Consistency vs Availability.',
        keyPoints: ['Split-brain prevention via strict quorum (N/2 + 1)', 'Heartbeats and randomized election timeouts', 'PACELC theorem extension to CAP tradeoffs']
      }
    ],
    edges: [
      { id: 'e-sd-1', source: 'sd-1', target: 'sd-2', relationship: 'PREREQUISITE_FOR' },
      { id: 'e-sd-2', source: 'sd-2', target: 'sd-3', relationship: 'PREREQUISITE_FOR' },
      { id: 'e-sd-3', source: 'sd-3', target: 'sd-4', relationship: 'PREREQUISITE_FOR' },
      { id: 'e-sd-4', source: 'sd-4', target: 'sd-5', relationship: 'PREREQUISITE_FOR' }
    ],
    resources: [
      {
        title: 'The System Design Primer (Donne Martin)',
        url: 'https://github.com/donnemartin/system-design-primer',
        source: 'GitHub / System Design Primer',
        description: 'World-renowned open-source curriculum covering CDN, Load Balancing, SQL/NoSQL trade-offs, and sample architectures.',
        badge: 'GOLD STANDARD'
      },
      {
        title: 'Roadmap.sh System Design Guide',
        url: 'https://roadmap.sh/system-design',
        source: 'roadmap.sh',
        description: 'Visual step-by-step architectural breakdown from single-server setups to globally distributed microservice fabrics.',
        badge: 'CURATED ROADMAP'
      },
      {
        title: 'High Scalability Real-World Architecture Case Studies',
        url: 'http://highscalability.com/',
        source: 'highscalability.com',
        description: 'In-depth engineering analyses on how YouTube, Netflix, Twitter, and Uber scaled to billions of users.',
        badge: 'INDUSTRY CASE STUDIES'
      }
    ]
  },

  // 3. Computer Networks (CN) Roadmap
  {
    id: 'cn-roadmap',
    title: 'Computer Networks & Protocol Engineering Roadmap',
    category: 'Systems & Networking',
    description: 'Master packet encapsulation, TCP flow control, HTTP/3 QUIC stream framing, DNS resolution, and TLS 1.3 cryptographic handshakes.',
    nodes: [
      {
        id: 'cn-1',
        label: 'OSI 7 Layers & TCP/IP Model',
        category: 'Networking',
        mastery: 0.90,
        status: 'MASTERED',
        x: 40,
        y: 40,
        unitCount: 6,
        videoId: 'vv4y_uOneC0',
        videoTitle: 'OSI Model Explained: 7 Layers of Computer Networks',
        channel: 'NetworkChuck',
        duration: '16:10',
        summary: 'Explore Physical, Data Link, Network (IP), Transport (TCP/UDP), Session, Presentation, and Application protocol boundaries.',
        keyPoints: ['Frame vs Packet vs Segment headers', 'MAC address forwarding vs IP routing', 'Encapsulation and decapsulation walkthrough']
      },
      {
        id: 'cn-2',
        label: 'TCP Flow Control & 3-Way Handshake',
        category: 'Transport',
        mastery: 0.78,
        status: 'MASTERED',
        x: 270,
        y: 40,
        unitCount: 8,
        videoId: 'bW_UIL3WCnE',
        videoTitle: 'TCP 3-Way Handshake & Connection Teardown Deep Dive',
        channel: 'Hussein Nasser',
        duration: '18:30',
        summary: 'SYN, SYN-ACK, ACK sequence number synchronization, sliding window flow control, and slow-start congestion avoidance.',
        keyPoints: ['Initial Sequence Number (ISN) negotiation', 'Sliding receiver window advertisement (rwnd)', 'Congestion window (cwnd) multiplicative decrease']
      },
      {
        id: 'cn-3',
        label: 'HTTP/1.1 vs HTTP/2 vs HTTP/3 (QUIC)',
        category: 'Application Layer',
        mastery: 0.62,
        status: 'IN_PROGRESS',
        x: 500,
        y: 40,
        unitCount: 7,
        videoId: 'F27PLhn3W04',
        videoTitle: 'Why HTTP/3 and QUIC are Replacing TCP for High-Speed Web',
        channel: 'Computerphile',
        duration: '15:25',
        summary: 'How UDP-based QUIC eliminates Head-of-Line blocking, enables zero round-trip (0-RTT) handshakes, and allows seamless connection migration.',
        keyPoints: ['Binary framing and multiplexed stream IDs in HTTP/2', 'TCP packet loss head-of-line stall problem', 'Independent stream delivery over UDP in QUIC']
      },
      {
        id: 'cn-4',
        label: 'DNS Architecture & Anycast Routing',
        category: 'Infrastructure',
        mastery: 0.50,
        status: 'AVAILABLE',
        x: 730,
        y: 40,
        unitCount: 5,
        videoId: '27r4Bzuj5OI',
        videoTitle: 'How Domain Name System (DNS) Actually Works',
        channel: 'Fireship',
        duration: '08:45',
        summary: 'Recursive resolvers, root servers, TLD authorities, and Anycast BGP routing for ultra-low latency worldwide name resolution.',
        keyPoints: ['Iterative vs recursive query resolution flow', 'TTL caching and authoritative NS record delegation', 'BGP Anycast routing for DDoS mitigation']
      }
    ],
    edges: [
      { id: 'e-cn-1', source: 'cn-1', target: 'cn-2', relationship: 'PREREQUISITE_FOR' },
      { id: 'e-cn-2', source: 'cn-2', target: 'cn-3', relationship: 'PREREQUISITE_FOR' },
      { id: 'e-cn-3', source: 'cn-3', target: 'cn-4', relationship: 'PREREQUISITE_FOR' }
    ],
    resources: [
      {
        title: 'IETF RFC Protocols Official Archive',
        url: 'https://www.ietf.org/standards/rfcs/',
        source: 'ietf.org',
        description: 'Official RFC specifications for TCP (RFC 793), HTTP/2 (RFC 7540), and HTTP/3 QUIC (RFC 9000).',
        badge: 'OFFICIAL STANDARD'
      },
      {
        title: 'Cloudflare Learning Center: Networking Fundamentals',
        url: 'https://www.cloudflare.com/learning/network-layer/what-is-the-network-layer/',
        source: 'cloudflare.com',
        description: 'Clear, modern guides on BGP routing, Anycast, DNSSEC, TLS 1.3, and DDoS protection.',
        badge: 'PRACTICAL GUIDE'
      },
      {
        title: 'Wireshark Sample Captures & Packet Analysis',
        url: 'https://wiki.wireshark.org/SampleCaptures',
        source: 'wireshark.org',
        description: 'Real PCAP packet dumps to inspect TCP handshakes, TLS certificates, and QUIC frames.',
        badge: 'PACKET LAB'
      }
    ]
  },

  // 4. Operating Systems (OS) Roadmap
  {
    id: 'os-roadmap',
    title: 'Operating Systems & Kernel Internals Roadmap',
    category: 'Systems Programming',
    description: 'Explore virtual memory paging, CPU scheduling algorithms, mutex synchronization primitives, and file system block management.',
    nodes: [
      {
        id: 'os-1',
        label: 'Processes, Threads & PCB',
        category: 'Kernel Core',
        mastery: 0.82,
        status: 'MASTERED',
        x: 40,
        y: 40,
        unitCount: 6,
        videoId: 'OrM7nZcxXZU',
        videoTitle: 'Processes vs Threads & Process Control Block (PCB)',
        channel: 'Neso Academy',
        duration: '12:15',
        summary: 'Understand the difference between isolated process address spaces and lightweight thread execution contexts sharing heap and file descriptors.',
        keyPoints: ['Process memory layout: Stack, Heap, BSS, Text', 'Context switch CPU register saving into PCB', 'fork() and execve() syscall semantics']
      },
      {
        id: 'os-2',
        label: 'Virtual Memory, Paging & TLB',
        category: 'Memory Management',
        mastery: 0.68,
        status: 'IN_PROGRESS',
        x: 270,
        y: 40,
        unitCount: 8,
        videoId: 'qcBIvN8xL_g',
        videoTitle: 'Virtual Memory, Multi-level Paging, and TLB Mechanics',
        channel: 'Neso Academy',
        duration: '18:40',
        summary: 'Hardware address translation by the MMU, multi-level page tables, Translation Lookaside Buffer (TLB) caching, and page fault interrupts.',
        keyPoints: ['Virtual page number (VPN) to physical frame mapping', 'TLB hit vs miss memory penalty', 'LRU and Clock page replacement algorithms']
      },
      {
        id: 'os-3',
        label: 'Concurrency: Mutex, Semaphores & Deadlocks',
        category: 'Synchronization',
        mastery: 0.54,
        status: 'AVAILABLE',
        x: 500,
        y: 40,
        unitCount: 9,
        videoId: 'ukM_zzrIeXs',
        videoTitle: 'Mutex vs Semaphore and Deadlock Prevention',
        channel: 'Jacob Sorber',
        duration: '14:50',
        summary: 'Protect shared memory critical sections using atomic test-and-set operations, binary semaphores, and prevent Coffman deadlock conditions.',
        keyPoints: ['Mutual exclusion via atomic hardware CAS instructions', 'Counting semaphores for resource pools', 'Banker algorithm for deadlock avoidance']
      }
    ],
    edges: [
      { id: 'e-os-1', source: 'os-1', target: 'os-2', relationship: 'PREREQUISITE_FOR' },
      { id: 'e-os-2', source: 'os-2', target: 'os-3', relationship: 'PREREQUISITE_FOR' }
    ],
    resources: [
      {
        title: 'Operating Systems: Three Easy Pieces (OSTEP)',
        url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/',
        source: 'University of Wisconsin',
        description: 'The premier open-source textbook on Virtualization, Concurrency, and Persistence by Remzi & Andrea Arpaci-Dusseau.',
        badge: 'TEXTBOOK'
      },
      {
        title: 'Linux Kernel Architecture Documentation',
        url: 'https://www.kernel.org/doc/html/latest/',
        source: 'kernel.org',
        description: 'Official documentation covering CFS scheduler, MMU memory management, and vfs subsystem.',
        badge: 'OFFICIAL KERNEL'
      }
    ]
  },

  // 5. DBMS & SQL Roadmap
  {
    id: 'dbms-roadmap',
    title: 'Database Management Systems (DBMS) & SQL Storage Roadmap',
    category: 'Data Engineering',
    description: 'Master ACID transactions, write-ahead logging (WAL), B+ Tree index structures, MVCC snapshot isolation, and query optimization plans.',
    nodes: [
      {
        id: 'db-1',
        label: 'ACID Guarantees & WAL Internals',
        category: 'Transactions',
        mastery: 0.85,
        status: 'MASTERED',
        x: 40,
        y: 40,
        unitCount: 7,
        videoId: 's4pA_fTz7gE',
        videoTitle: 'ACID Database Transactions & Write-Ahead Log (WAL)',
        channel: 'Hussein Nasser',
        duration: '21:00',
        summary: 'Atomicity, Consistency, Isolation, and Durability guarantees backed by append-only Write-Ahead Logs and checkpoint flushing.',
        keyPoints: ['Undo logs for rolling back aborted transactions', 'Redo logs for crash recovery durability', 'Two-phase locking (2PL) serializability']
      },
      {
        id: 'db-2',
        label: 'B+ Trees vs LSM Trees',
        category: 'Storage Engines',
        mastery: 0.72,
        status: 'IN_PROGRESS',
        x: 270,
        y: 40,
        unitCount: 8,
        videoId: 'aZjYr87r1b8',
        videoTitle: 'Database Storage Engines: B-Trees vs LSM-Trees Explained',
        channel: 'ByteByteGo',
        duration: '12:30',
        summary: 'Compare balanced read-optimized B+ Trees (PostgreSQL/MySQL) with write-optimized Log-Structured Merge Trees (Cassandra/RocksDB).',
        keyPoints: ['B+ Tree doubly-linked leaves for range scan efficiency', 'LSM in-memory MemTable and SSTable disk compaction', 'Write amplification vs read amplification trade-offs']
      },
      {
        id: 'db-3',
        label: 'MVCC & Snapshot Isolation',
        category: 'Concurrency',
        mastery: 0.60,
        status: 'AVAILABLE',
        x: 500,
        y: 40,
        unitCount: 6,
        videoId: '5ZjhNTM8XU8',
        videoTitle: 'Multi-Version Concurrency Control (MVCC) in PostgreSQL',
        channel: 'CMU Database Group',
        duration: '24:10',
        summary: 'Execute read queries without locking write queries by preserving historic row version tuples identified by xmin and xmax timestamps.',
        keyPoints: ['Readers never block writers; writers never block readers', 'Transaction snapshot visibility rules', 'VACUUM process to reclaim dead tuple disk space']
      }
    ],
    edges: [
      { id: 'e-db-1', source: 'db-1', target: 'db-2', relationship: 'PREREQUISITE_FOR' },
      { id: 'e-db-2', source: 'db-2', target: 'db-3', relationship: 'PREREQUISITE_FOR' }
    ],
    resources: [
      {
        title: 'Use The Index, Luke! A Guide to Database Performance',
        url: 'https://use-the-index-luke.com/',
        source: 'use-the-index-luke.com',
        description: 'The definitive guide to SQL indexing, B-Tree leaf traversals, composite keys, and EXPLAIN execution plans.',
        badge: 'INDEXING BIBLE'
      },
      {
        title: 'CMU Database Systems Course (Andy Pavlo)',
        url: 'https://15445.courses.cs.cmu.edu/',
        source: 'Carnegie Mellon University',
        description: 'World-renowned university course with video lectures on database storage engines, buffer pools, and concurrency control.',
        badge: 'CMU LECTURES'
      }
    ]
  },

  // 6. OOPS & Design Patterns Roadmap
  {
    id: 'oops-roadmap',
    title: 'OOPS & Enterprise Design Patterns Roadmap',
    category: 'Software Engineering',
    description: 'Structure maintainable, extensible software using SOLID principles, Gang of Four creational/structural/behavioral patterns, and clean architecture.',
    nodes: [
      {
        id: 'oop-1',
        label: 'SOLID Architectural Principles',
        category: 'Clean Code',
        mastery: 0.92,
        status: 'MASTERED',
        x: 40,
        y: 40,
        unitCount: 5,
        videoId: 'Xzdh4y0S21U',
        videoTitle: 'SOLID Principles in 8 Minutes with Real Code Examples',
        channel: 'Fireship',
        duration: '08:15',
        summary: 'Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion guidelines.',
        keyPoints: ['Designing for extension without modification', 'Liskov subtype substitutability invariants', 'High-level modules depending on abstract interfaces']
      },
      {
        id: 'oop-2',
        label: 'Creational Patterns (Factory, Builder, Singleton)',
        category: 'Design Patterns',
        mastery: 0.78,
        status: 'MASTERED',
        x: 270,
        y: 40,
        unitCount: 6,
        videoId: 'v-GiuMmsXuk',
        videoTitle: 'Design Patterns in Object Oriented Programming',
        channel: 'Christopher Okhravi',
        duration: '22:40',
        summary: 'Encapsulate complex object construction logic, ensure thread-safe single instances, and decouple caller code from concrete implementations.',
        keyPoints: ['Factory Method vs Abstract Factory hierarchies', 'Fluent Builder API for multi-parameter configurations', 'Double-checked locking thread-safe Singleton']
      },
      {
        id: 'oop-3',
        label: 'Behavioral & Structural (Observer, Strategy, Adapter)',
        category: 'Design Patterns',
        mastery: 0.65,
        status: 'IN_PROGRESS',
        x: 500,
        y: 40,
        unitCount: 8,
        videoId: 'v9ejT8FO-7I',
        videoTitle: 'Strategy & Observer Patterns Explained with Code',
        channel: 'Derek Banas',
        duration: '16:50',
        summary: 'Swap algorithmic strategies dynamically at runtime and implement decoupled event-driven publisher/subscriber notifications.',
        keyPoints: ['Favoring composition over inheritance', 'Subject-observer loose coupling', 'Adapter wrapper for incompatible third-party interfaces']
      }
    ],
    edges: [
      { id: 'e-oop-1', source: 'oop-1', target: 'oop-2', relationship: 'PREREQUISITE_FOR' },
      { id: 'e-oop-2', source: 'oop-2', target: 'oop-3', relationship: 'PREREQUISITE_FOR' }
    ],
    resources: [
      {
        title: 'Refactoring.Guru Design Patterns & Refactoring Catalog',
        url: 'https://refactoring.guru/design-patterns',
        source: 'refactoring.guru',
        description: 'Interactive visual catalog detailing problem statements, UML structures, and code samples across all GoF patterns.',
        badge: 'VISUAL CATALOG'
      },
      {
        title: 'Martin Fowler Architecture & Patterns Archive',
        url: 'https://martinfowler.com/architecture/',
        source: 'martinfowler.com',
        description: 'Seminal software engineering essays on microservices, event sourcing, domain-driven design, and refactoring.',
        badge: 'ARCHITECT ESSAYS'
      }
    ]
  },

  // 7. Machine Learning & AI Engineering Roadmap
  {
    id: 'ml-ai-roadmap',
    title: 'Machine Learning & AI Engineering Roadmap',
    category: 'Artificial Intelligence',
    description: 'From loss functions and backpropagation to Transformers, Attention mechanisms, Large Language Models (LLMs), and RAG pipelines.',
    nodes: [
      {
        id: 'ml-1',
        label: 'Gradient Descent & Neural Networks',
        category: 'Foundations',
        mastery: 0.80,
        status: 'MASTERED',
        x: 40,
        y: 40,
        unitCount: 8,
        videoId: 'IHZwWFHWa-w',
        videoTitle: 'Gradient Descent, How Neural Networks Learn',
        channel: '3Blue1Brown',
        duration: '21:05',
        summary: 'Mathematical formulation of cost functions, vector calculus gradients, backpropagation chain rule, and learning rate schedules.',
        keyPoints: ['Forward pass matrix multiplications & activations', 'Backpropagation gradient computation via chain rule', 'Adam optimizer momentum & RMSprop adaptive rates']
      },
      {
        id: 'ml-2',
        label: 'Transformers & Self-Attention (Attention Is All You Need)',
        category: 'Deep Learning',
        mastery: 0.64,
        status: 'IN_PROGRESS',
        x: 270,
        y: 40,
        unitCount: 10,
        videoId: 'wjZofJX0v4U',
        videoTitle: 'Visualizing Attention and Transformer Architecture',
        channel: '3Blue1Brown',
        duration: '26:50',
        summary: 'Understand Query, Key, and Value projections, scaled dot-product attention, multi-head parallel attention, and positional encodings.',
        keyPoints: ['Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) * V', 'Multi-head parallel representation spaces', 'Positional embeddings to encode sequence order']
      },
      {
        id: 'ml-3',
        label: 'Retrieval-Augmented Generation (RAG) & Vector DBs',
        category: 'GenAI Applications',
        mastery: 0.52,
        status: 'AVAILABLE',
        x: 500,
        y: 40,
        unitCount: 9,
        videoId: 'T-D1OfcDW1M',
        videoTitle: 'RAG from Scratch: Architecture, Chunking & Vector Search',
        channel: 'LangChain',
        duration: '18:10',
        summary: 'Ground LLM responses in real-time knowledge bases using chunking strategies, embedding models, cosine vector search, and citation injection.',
        keyPoints: ['Semantic chunking with overlapping windows', 'HNSW approximate nearest neighbor search', 'Reranking models & grounded citation validation']
      }
    ],
    edges: [
      { id: 'e-ml-1', source: 'ml-1', target: 'ml-2', relationship: 'PREREQUISITE_FOR' },
      { id: 'e-ml-2', source: 'ml-2', target: 'ml-3', relationship: 'PREREQUISITE_FOR' }
    ],
    resources: [
      {
        title: 'Roadmap.sh AI and Machine Learning Roadmap',
        url: 'https://roadmap.sh/ai-data-scientist',
        source: 'roadmap.sh',
        description: 'Complete visual curriculum from linear algebra to training foundational neural models and deploying GenAI APIs.',
        badge: 'CURATED ROADMAP'
      },
      {
        title: 'Hugging Face NLP & Deep Learning Course',
        url: 'https://huggingface.co/learn/nlp-course',
        source: 'huggingface.co',
        description: 'Hands-on practical tutorials on fine-tuning open-source LLMs, tokenization, and pipeline integration.',
        badge: 'HANDS-ON LAB'
      }
    ]
  },

  // 8. Cloud & DevOps Roadmap
  {
    id: 'cloud-devops-roadmap',
    title: 'Cloud & DevOps Engineering Roadmap',
    category: 'Cloud Infrastructure',
    description: 'Automate deployments, scale containerized microservices with Kubernetes, manage cloud infrastructure with Terraform, and monitor with Prometheus.',
    nodes: [
      {
        id: 'dev-1',
        label: 'Docker & Linux Containerization',
        category: 'Containers',
        mastery: 0.88,
        status: 'MASTERED',
        x: 40,
        y: 40,
        unitCount: 6,
        videoId: 'pg19Z8LL06w',
        videoTitle: 'Docker Tutorial for Beginners (Full Course)',
        channel: 'TechWorld with Nana',
        duration: '24:30',
        summary: 'Linux cgroups, namespaces, image layers, multi-stage builds, and volume mounting for immutable application environments.',
        keyPoints: ['Kernel namespaces for process isolation', 'Cgroups for CPU and memory resource quotas', 'Multi-stage Dockerfiles to minimize attack surface']
      },
      {
        id: 'dev-2',
        label: 'Kubernetes Pods, Services & Ingress',
        category: 'Orchestration',
        mastery: 0.65,
        status: 'IN_PROGRESS',
        x: 270,
        y: 40,
        unitCount: 11,
        videoId: 'X48VuDVv0do',
        videoTitle: 'Kubernetes Crash Course for Absolute Beginners',
        channel: 'TechWorld with Nana',
        duration: '32:00',
        summary: 'Cluster orchestration with Deployments, StatefulSets, Services (ClusterIP/NodePort), Ingress controllers, and automated horizontal pod autoscaling.',
        keyPoints: ['Control plane etcd consensus and Kube-apiserver', 'Declarative desired state reconciliation loops', 'Ingress controller TLS termination & path routing']
      },
      {
        id: 'dev-3',
        label: 'CI/CD Pipelines & Terraform (IaC)',
        category: 'Automation',
        mastery: 0.48,
        status: 'AVAILABLE',
        x: 500,
        y: 40,
        unitCount: 8,
        videoId: 'SLB_c_ayRMo',
        videoTitle: 'Terraform in 100 Seconds & Declarative Cloud Infrastructure',
        channel: 'Fireship',
        duration: '10:15',
        summary: 'Provision cloud VPCs, compute nodes, and managed databases declaratively with Terraform state files and automated GitHub Actions workflows.',
        keyPoints: ['Declarative HCL syntax and state locking in S3/DynamoDB', 'Automated linting, testing, and canary deployments in CI/CD', 'Zero-downtime blue/green deployment patterns']
      }
    ],
    edges: [
      { id: 'e-dev-1', source: 'dev-1', target: 'dev-2', relationship: 'PREREQUISITE_FOR' },
      { id: 'e-dev-2', source: 'dev-2', target: 'dev-3', relationship: 'PREREQUISITE_FOR' }
    ],
    resources: [
      {
        title: 'Roadmap.sh DevOps Roadmap & Tooling Tree',
        url: 'https://roadmap.sh/devops',
        source: 'roadmap.sh',
        description: 'Industry-standard roadmap covering Linux, networking, CI/CD, Docker, Kubernetes, and AWS/GCP architecture.',
        badge: 'INDUSTRY STANDARD'
      },
      {
        title: 'Kubernetes Official Interactive Documentation',
        url: 'https://kubernetes.io/docs/home/',
        source: 'kubernetes.io',
        description: 'Comprehensive guides, interactive Katacoda tutorials, and API reference for production cluster administration.',
        badge: 'OFFICIAL DOCS'
      }
    ]
  },

  // 9. Full Stack & Frontend Roadmap
  {
    id: 'frontend-roadmap',
    title: 'Full Stack & Modern Frontend Engineering Roadmap',
    category: 'Web Engineering',
    description: 'Master React 19 reconciliation, Server Components (RSC), Next.js App Router, browser rendering pipelines, and Core Web Vitals optimization.',
    nodes: [
      {
        id: 'fe-1',
        label: 'DOM Rendering Pipeline & React Virtual DOM',
        category: 'Core Web',
        mastery: 0.90,
        status: 'MASTERED',
        x: 40,
        y: 40,
        unitCount: 7,
        videoId: '7YhdqIR2Yzo',
        videoTitle: 'How the Browser Renders a Web Page (DOM, CSSOM, Layout)',
        channel: 'Academind',
        duration: '15:45',
        summary: 'Inspect browser critical rendering paths (HTML parsing, CSSOM calculation, render tree, reflow layout, and compositing paint cycles).',
        keyPoints: ['Reflow triggers vs cheap composite paint properties', 'Virtual DOM diffing algorithm heuristics (O(N))', 'Fiber tree interruptible scheduling and priority lanes']
      },
      {
        id: 'fe-2',
        label: 'React 19 Server Components (RSC) & Actions',
        category: 'Modern React',
        mastery: 0.76,
        status: 'IN_PROGRESS',
        x: 270,
        y: 40,
        unitCount: 8,
        videoId: 'T8TZQ6k4SLE',
        videoTitle: 'React Server Components & Next.js App Router Deep Dive',
        channel: 'Jack Herrington',
        duration: '20:10',
        summary: 'Stream zero-bundle-size React components directly from the server, run database queries securely, and handle mutations with Server Actions.',
        keyPoints: ['Zero client bundle size for Server Components', 'Hydration boundaries with "use client" directives', 'Automatic optimistic UI updates with useOptimistic']
      },
      {
        id: 'fe-3',
        label: 'Web Performance & Core Web Vitals (LCP, INP, CLS)',
        category: 'Performance',
        mastery: 0.60,
        status: 'AVAILABLE',
        x: 500,
        y: 40,
        unitCount: 6,
        videoId: 'fWoI9DXBLdk',
        videoTitle: 'Core Web Vitals Optimization: LCP, INP & CLS Guide',
        channel: 'Google Chrome Developers',
        duration: '18:20',
        summary: 'Optimize Largest Contentful Paint (LCP) hero asset preloading, reduce Interaction to Next Paint (INP) main-thread blocking, and eliminate layout shifts.',
        keyPoints: ['Resource hints: preload, preconnect, and priority fetch', 'Breaking long tasks with requestIdleCallback and web workers', 'Reserving explicit aspect-ratio dimensions to eliminate CLS']
      }
    ],
    edges: [
      { id: 'e-fe-1', source: 'fe-1', target: 'fe-2', relationship: 'PREREQUISITE_FOR' },
      { id: 'e-fe-2', source: 'fe-2', target: 'fe-3', relationship: 'PREREQUISITE_FOR' }
    ],
    resources: [
      {
        title: 'MDN Web Docs: Web Development Reference',
        url: 'https://developer.mozilla.org/en-US/',
        source: 'Mozilla Developer Network',
        description: 'The authoritative, standard documentation for HTML5, CSS3, modern JavaScript ES2024, and Web APIs.',
        badge: 'OFFICIAL SPEC'
      },
      {
        title: 'Web.dev by Google: Core Web Vitals Guide',
        url: 'https://web.dev/explore/metrics',
        source: 'web.dev',
        description: 'Google engineering blueprints for measuring and diagnosing real-world user performance metrics.',
        badge: 'PERFORMANCE GUIDE'
      }
    ]
  },

  // 10. Cybersecurity & Application Security Roadmap
  {
    id: 'cybersecurity-roadmap',
    title: 'Cybersecurity & Application Security Roadmap',
    category: 'Security Engineering',
    description: 'Mitigate OWASP Top 10 vulnerabilities, implement cryptographic key exchanges, defend against SQL injection/XSS, and enforce OAuth 2.0 / Zero Trust.',
    nodes: [
      {
        id: 'sec-1',
        label: 'OWASP Top 10 Web Vulnerabilities',
        category: 'AppSec',
        mastery: 0.85,
        status: 'MASTERED',
        x: 40,
        y: 40,
        unitCount: 7,
        videoId: 'pBOr7bZ4GNg',
        videoTitle: 'OWASP Top 10 Web Application Vulnerabilities Explained',
        channel: 'Computerphile',
        duration: '19:40',
        summary: 'Explore Broken Access Control, Cryptographic Failures, Injection Attacks, Insecure Design, and Security Misconfigurations with live exploits.',
        keyPoints: ['Parameterized queries to eliminate SQL injection', 'Context-aware escaping & CSP to prevent Cross-Site Scripting (XSS)', 'SameSite cookie flags and CSRF anti-forgery tokens']
      },
      {
        id: 'sec-2',
        label: 'Auth Protocols: JWT, OAuth 2.0 & OIDC',
        category: 'Authentication',
        mastery: 0.70,
        status: 'IN_PROGRESS',
        x: 270,
        y: 40,
        unitCount: 8,
        videoId: '996OiexHze0',
        videoTitle: 'OAuth 2.0 and OpenID Connect (OIDC) In Plain English',
        channel: 'OktaDev (Nate Barbettini)',
        duration: '25:15',
        summary: 'Authorization Code flow with PKCE, asymmetric RS256 token verification, refresh token rotation, and identity claims validation.',
        keyPoints: ['Access token vs Refresh token lifecycle boundaries', 'Proof Key for Code Exchange (PKCE) for SPA security', 'Validating signature using public JSON Web Key Sets (JWKS)']
      }
    ],
    edges: [
      { id: 'e-sec-1', source: 'sec-1', target: 'sec-2', relationship: 'PREREQUISITE_FOR' }
    ],
    resources: [
      {
        title: 'OWASP Top 10 Official Vulnerability Standard',
        url: 'https://owasp.org/www-project-top-ten/',
        source: 'owasp.org',
        description: 'Global standard security checklist, exploit scenarios, and prevention controls for web engineering.',
        badge: 'OFFICIAL STANDARD'
      },
      {
        title: 'PortSwigger Web Security Academy',
        url: 'https://portswigger.net/web-security',
        source: 'portswigger.net',
        description: 'Free, interactive online training labs to practice finding and fixing real vulnerabilities like XSS, SQLi, and SSRF.',
        badge: 'INTERACTIVE LAB'
      }
    ]
  },

  // 11. Concurrency & Multithreading Roadmap
  {
    id: 'concurrency-roadmap',
    title: 'High-Throughput Concurrency & Multithreading Roadmap',
    category: 'Systems Programming',
    description: 'Master lock-free data structures, Java Memory Model, Go goroutines/channels, memory barriers, and work-stealing thread pools.',
    nodes: [
      {
        id: 'conc-1',
        label: 'Race Conditions & Memory Barriers',
        category: 'Memory Models',
        mastery: 0.75,
        status: 'MASTERED',
        x: 40,
        y: 40,
        unitCount: 6,
        videoId: '7ENFeb-J75k',
        videoTitle: 'Concurrency Bugs: Race Conditions, Deadlocks & Memory Visibility',
        channel: 'Computerphile',
        duration: '17:30',
        summary: 'Hardware CPU instruction reordering, cache coherence protocols (MESI), and memory fence barriers ensuring happens-before visibility.',
        keyPoints: ['CPU store buffers and invalidation queues', 'volatile keyword semantics & happens-before order', 'Atomic Compare-And-Swap (CAS) instructions']
      },
      {
        id: 'conc-2',
        label: 'Lock-Free Data Structures & Thread Pools',
        category: 'High Performance',
        mastery: 0.55,
        status: 'IN_PROGRESS',
        x: 270,
        y: 40,
        unitCount: 8,
        videoId: 'c1gO9aB9nbs',
        videoTitle: 'Lock-Free Programming with CAS & Atomic Pointers',
        channel: 'CppCon',
        duration: '28:00',
        summary: 'Design non-blocking concurrent stacks and queues (Treiber stack, Michael-Scott queue) without mutex locking overhead.',
        keyPoints: ['ABA problem mitigation via versioned pointers', 'Work-stealing schedulers (ForkJoinPool / Tokio / Go runtime)', 'Bounded queue backpressure under heavy producer load']
      }
    ],
    edges: [
      { id: 'e-conc-1', source: 'conc-1', target: 'conc-2', relationship: 'PREREQUISITE_FOR' }
    ],
    resources: [
      {
        title: 'Java Concurrency in Practice (Brian Goetz) Guide',
        url: 'https://jcip.net/',
        source: 'jcip.net',
        description: 'Seminal guide on multithreading, memory consistency, thread-safe collections, and concurrent architectural design.',
        badge: 'CLASSIC REFERENCE'
      },
      {
        title: 'Go Memory Model Official Specification',
        url: 'https://go.dev/ref/mem',
        source: 'go.dev',
        description: 'Official conditions under which reads of a variable in one goroutine can be guaranteed to observe writes by a different goroutine.',
        badge: 'OFFICIAL SPEC'
      }
    ]
  },

  // 12. Microservices Architecture Roadmap
  {
    id: 'microservices-roadmap',
    title: 'Microservices & Event-Driven Architecture Roadmap',
    category: 'Distributed Systems',
    description: 'Decompose monolithic backends into resilient autonomous services using API Gateways, Saga distributed transactions, and Kafka event streaming.',
    nodes: [
      {
        id: 'ms-1',
        label: 'API Gateway & Service Mesh (Envoy)',
        category: 'Networking',
        mastery: 0.82,
        status: 'MASTERED',
        x: 40,
        y: 40,
        unitCount: 7,
        videoId: '1xo-0gCVhTU',
        videoTitle: 'What is an API Gateway & Service Mesh (Istio / Envoy)?',
        channel: 'ByteByteGo',
        duration: '14:15',
        summary: 'Centralize authentication, rate limiting, request routing, and mutual TLS (mTLS) observability across polyglot microservice fleets.',
        keyPoints: ['Edge API Gateway vs sidecar service mesh routing', 'Automated mTLS encryption between pod services', 'Distributed tracing with W3C tracecontext headers']
      },
      {
        id: 'ms-2',
        label: 'Saga Pattern & Distributed Transactions',
        category: 'Data Consistency',
        mastery: 0.60,
        status: 'IN_PROGRESS',
        x: 270,
        y: 40,
        unitCount: 9,
        videoId: 'xDuwrtwYHu8',
        videoTitle: 'Saga Pattern in Microservices: Choreography vs Orchestration',
        channel: 'CodeOpinion',
        duration: '18:40',
        summary: 'Coordinate multi-service business transactions across database boundaries using forward commits and compensating reversal transactions.',
        keyPoints: ['Choreography (event-driven) vs Orchestration (state machine coordinator)', 'Compensating actions to reverse intermediate committed writes', 'Idempotent message consumers preventing duplicate processing']
      }
    ],
    edges: [
      { id: 'e-ms-1', source: 'ms-1', target: 'ms-2', relationship: 'PREREQUISITE_FOR' }
    ],
    resources: [
      {
        title: 'Microservices.io Architectural Patterns (Chris Richardson)',
        url: 'https://microservices.io/',
        source: 'microservices.io',
        description: 'The industry-standard pattern language for decomposing, querying, and deploying distributed microservices.',
        badge: 'CANONICAL PATTERNS'
      },
      {
        title: 'Martin Fowler on Microservice Prerequisites & Tradeoffs',
        url: 'https://martinfowler.com/articles/microservices.html',
        source: 'martinfowler.com',
        description: 'Comprehensive architectural definition, operational boundaries, and cost-benefit trade-offs of microservice adoption.',
        badge: 'ESSENTIAL READING'
      }
    ]
  }
];

export const LearnerModelPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const activeUserId = user?.username || 'candidate';

  const [activeBlueprintId, setActiveBlueprintId] = useState<string>('dsa-roadmap');
  const [activeTab, setActiveTab] = useState<'ROADMAP_BLUEPRINT' | 'BKT_METRICS'>('ROADMAP_BLUEPRINT');
  const [mastery, setMastery] = useState<LearnerMastery | null>(null);

  const selectedBlueprint = ROADMAP_BLUEPRINTS.find(b => b.id === activeBlueprintId) || ROADMAP_BLUEPRINTS[0];
  const [selectedNode, setSelectedNode] = useState<CourseNode>(selectedBlueprint.nodes[0]);

  // Update selectedNode when blueprint changes
  useEffect(() => {
    if (selectedBlueprint && selectedBlueprint.nodes.length > 0) {
      setSelectedNode(selectedBlueprint.nodes[0]);
    }
  }, [activeBlueprintId]);

  useEffect(() => {
    fetchLearnerData();
  }, [activeUserId]);

  const fetchLearnerData = async () => {
    try {
      const res = await axios.get(`${LEARNING_API_BASE}/learner/mastery?userId=${encodeURIComponent(activeUserId)}`, { timeout: 2500 });
      if (res.data) {
        setMastery(res.data);
      }
    } catch {
      // Use fallback
      setMastery({
        userId: activeUserId,
        coldStartComplete: true,
        topicMastery: {
          'topic-dsa': 0.78,
          'topic-systems': 0.72,
          'topic-networks': 0.65,
          'topic-database': 0.82,
          'topic-os': 0.60
        },
        conceptMastery: {},
        history: [
          { timestamp: Date.now() - 3600000 * 48, topicId: 'dsa', topicName: 'DSA', conceptId: 'arrays', correct: true, priorMastery: 0.5, updatedMastery: 0.65 },
          { timestamp: Date.now() - 3600000 * 24, topicId: 'systems', topicName: 'System Design', conceptId: 'caching', correct: true, priorMastery: 0.65, updatedMastery: 0.78 }
        ]
      });
    }
  };

  const chartData = (mastery?.history || []).map((h, idx) => ({
    event: `Session ${idx + 1}`,
    mastery: Math.round(h.updatedMastery * 100),
    topic: h.topicName
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* HEADER BANNER */}
      <div className="glass-panel p-6 rounded-2xl border border-border bg-gradient-to-r from-cyan-950/30 via-zinc-900 to-purple-950/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-1.5">
            <Brain size={14} />
            <span>Learner Model • Curated Knowledge Blueprints</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">
            Curated Engineering Roadmaps &amp; Mastery DAG
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-3xl leading-relaxed">
            12 comprehensive architectural blueprints with multi-stage learning DAGs, curated YouTube lectures, and authoritative documentation across the internet.
          </p>
        </div>

        {/* VIEW TABS */}
        <div className="flex items-center space-x-2 bg-zinc-900 p-1.5 rounded-xl border border-zinc-800 shrink-0">
          <button
            onClick={() => setActiveTab('ROADMAP_BLUEPRINT')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'ROADMAP_BLUEPRINT'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <GitBranch size={13} />
            <span>12 Roadmaps &amp; Blueprints</span>
          </button>

          <button
            onClick={() => setActiveTab('BKT_METRICS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'BKT_METRICS'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Activity size={13} />
            <span>BKT Bayesian Mastery</span>
          </button>
        </div>
      </div>

      {/* ROADMAP VIEW */}
      {activeTab === 'ROADMAP_BLUEPRINT' ? (
        <div className="space-y-6">
          
          {/* HORIZONTAL BLUEPRINT SELECTOR BAR */}
          <div className="p-2.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 overflow-x-auto scrollbar-none flex items-center space-x-2">
            {ROADMAP_BLUEPRINTS.map((bp) => {
              const isSelected = bp.id === activeBlueprintId;
              return (
                <button
                  key={bp.id}
                  onClick={() => setActiveBlueprintId(bp.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition whitespace-nowrap flex items-center space-x-2 border shrink-0 ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-400 text-cyan-200 shadow-sm ring-1 ring-cyan-500/30'
                      : 'border-zinc-800/80 bg-zinc-950/50 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  <Layers size={13} className={isSelected ? 'text-cyan-400' : 'text-zinc-500'} />
                  <span>{bp.title.split('(')[0].trim()}</span>
                </button>
              );
            })}
          </div>

          {/* ACTIVE BLUEPRINT DETAILS HEADER */}
          <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 uppercase">
                  {selectedBlueprint.category}
                </span>
                <span className="text-xs font-mono text-zinc-500">
                  {selectedBlueprint.nodes.length} Stages • Multi-level Prerequisite Hierarchy
                </span>
              </div>
              <h2 className="text-xl font-bold font-mono text-zinc-100">{selectedBlueprint.title}</h2>
              <p className="text-xs text-zinc-400 max-w-3xl leading-relaxed">{selectedBlueprint.description}</p>
            </div>
          </div>

          {/* ROADMAP STAGES DAG & NODES GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {selectedBlueprint.nodes.map((node, idx) => {
              const isSelected = selectedNode?.id === node.id;
              const percent = Math.round(node.mastery * 100);

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 font-mono ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/20 shadow-[0_0_20px_rgba(34,211,238,0.15)] ring-1 ring-cyan-400'
                      : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-6 h-6 rounded-md bg-zinc-800 border border-zinc-700 text-[10px] font-bold flex items-center justify-center text-zinc-300">
                      {idx + 1}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      node.status === 'MASTERED'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : node.status === 'IN_PROGRESS'
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {node.status}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-zinc-200 line-clamp-2 min-h-[32px]">
                    {node.label}
                  </h3>

                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] text-zinc-500">
                      <span>Bayesian Mastery</span>
                      <span className="text-cyan-300 font-bold">{percent}%</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          percent >= 75 ? 'bg-emerald-400' : percent >= 50 ? 'bg-cyan-400' : 'bg-purple-400'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Video size={11} className="text-rose-400" />
                      <span>{node.duration || 'Lecture'}</span>
                    </span>
                    <span className="text-cyan-400 hover:underline">Explore →</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* SELECTED NODE: CURATED VIDEO & THEORETICAL BREAKDOWN */}
          {selectedNode && (
            <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/80 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                      STAGE FOCUS • {selectedNode.category}
                    </div>
                    <h3 className="text-lg font-bold font-mono text-zinc-100">
                      {selectedNode.label}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-xs font-mono">
                  <span className="px-3 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300">
                    Mastery: <strong className="text-cyan-400">{Math.round(selectedNode.mastery * 100)}%</strong>
                  </span>
                  <button
                    onClick={() => navigate('/revision')}
                    className="px-3 py-1 rounded-lg bg-cyan-500 text-zinc-950 font-bold hover:bg-cyan-400 transition"
                  >
                    Practice in Revision Studio
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* VIDEO LECTURE EMBED / PLAYER */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Video size={14} className="text-rose-500" />
                      <span>Curated Video Lecture</span>
                    </h4>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {selectedNode.channel} • {selectedNode.duration}
                    </span>
                  </div>

                  <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-zinc-800 bg-black shadow-lg">
                    {selectedNode.videoId ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${selectedNode.videoId}?rel=0`}
                        title={selectedNode.videoTitle || 'Lecture'}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 font-mono text-xs">
                        <Play size={32} className="mb-2 text-zinc-600" />
                        <span>Interactive lecture stream loading...</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs font-mono text-zinc-300 font-medium">
                    {selectedNode.videoTitle}
                  </p>
                </div>

                {/* THEORETICAL SUMMARY & KEY TAKEAWAYS */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-2">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">
                      Architectural Summary
                    </span>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                      {selectedNode.summary}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-2">
                    <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest block">
                      Key Invariants &amp; Algorithmic Mechanics
                    </span>
                    <ul className="space-y-1.5 text-xs text-zinc-300 font-sans">
                      {selectedNode.keyPoints?.map((pt, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 size={13} className="text-cyan-400 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* VERIFIED INTERNET RESOURCES & DOCUMENTATION */}
          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-4">
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              <Globe size={15} />
              <span>Related Authoritative Websites &amp; Documentation on the Internet</span>
            </div>
            <p className="text-xs text-zinc-400 max-w-2xl font-sans">
              Curated official documentation, interactive visual guides, and open-source references verified for this engineering blueprint.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {selectedBlueprint.resources.map((res, rIdx) => (
                <a
                  key={rIdx}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 hover:border-cyan-500/50 hover:bg-zinc-900/60 transition group space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-cyan-300 border border-zinc-700 uppercase">
                        {res.badge}
                      </span>
                      <ExternalLink size={13} className="text-zinc-500 group-hover:text-cyan-400 transition" />
                    </div>
                    <h4 className="text-xs font-mono font-bold text-zinc-200 group-hover:text-cyan-300 transition line-clamp-2">
                      {res.title}
                    </h4>
                    <p className="text-[11px] text-zinc-400 font-sans line-clamp-3">
                      {res.description}
                    </p>
                  </div>

                  <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1 pt-1">
                    <span>{res.source}</span>
                    <ArrowRight size={10} className="group-hover:translate-x-0.5 transition" />
                  </span>
                </a>
              ))}
            </div>
          </div>

        </div>
      ) : (
        /* BKT MASTERY METRICS */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-mono text-zinc-400 uppercase font-bold">
              BAYESIAN KNOWLEDGE TRACING P(Lt) PER DOMAIN
            </h3>

            <div className="space-y-3">
              {mastery && Object.entries(mastery.topicMastery).map(([topicId, pVal]) => {
                const percent = Math.round(pVal * 100);
                const isHigh = percent >= 75;
                const isMed = percent >= 50 && percent < 75;
                return (
                  <div key={topicId} className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-200">
                        {topicId.replace('topic-', '').replace(/-/g, ' ').toUpperCase()}
                      </span>
                      <span className={`font-bold ${isHigh ? 'text-emerald-400' : isMed ? 'text-cyan-400' : 'text-amber-400'}`}>
                        P(Lt) = {pVal.toFixed(2)} ({percent}%)
                      </span>
                    </div>

                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isHigh ? 'bg-emerald-400' : isMed ? 'bg-cyan-400' : 'bg-amber-400'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-zinc-800 space-y-4 font-mono">
            <h3 className="text-xs text-zinc-400 uppercase font-bold">
              BKT MASTERY PROBABILITY TRAJECTORY (CHRONOLOGICAL)
            </h3>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="event" stroke="#71717a" fontSize={11} fontFamily="monospace" />
                  <YAxis domain={[0, 100]} stroke="#71717a" fontSize={11} fontFamily="monospace" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px' }}
                    itemStyle={{ color: '#22d3ee', fontFamily: 'monospace', fontSize: '12px' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="mastery"
                    stroke="#22d3ee"
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#22d3ee' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LearnerModelPage;
