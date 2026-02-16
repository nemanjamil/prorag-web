import {
  FileText,
  Search,
  GitBranch,
  FlaskConical,
  DollarSign,
  CheckCircle,
  Scissors,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  phase: number;
  enabled: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Documents', path: '/documents', icon: FileText, phase: 2, enabled: true },
  { label: 'Query', path: '/query', icon: Search, phase: 4, enabled: true },
  { label: 'Pipeline', path: '/pipeline', icon: GitBranch, phase: 6, enabled: true },
  { label: 'Experiments', path: '/experiments', icon: FlaskConical, phase: 7, enabled: true },
  { label: 'Costs', path: '/costs', icon: DollarSign, phase: 8, enabled: true },
  { label: 'Evaluation', path: '/evaluation', icon: CheckCircle, phase: 9, enabled: false },
  { label: 'Chunking Lab', path: '/chunking-playground', icon: Scissors, phase: 10, enabled: false },
];

export const CHUNK_STRATEGY_DESCRIPTIONS = {
  fixed: 'Split text into equal-sized chunks. Simple but may break mid-sentence.',
  recursive: 'Split by paragraphs, then sentences, then characters. Preserves natural boundaries.',
  semantic: 'Group sentences by meaning using embeddings. Best quality but slowest.',
} as const;

export const PLACEHOLDER_FEATURES: Record<string, string[]> = {
  '/query': [
    'Natural language queries against your documents',
    'Multiple query strategies (Direct, HyDE, Multi-Query, Step-Back)',
    'Hybrid search with Vector + BM25',
    'Reranking with Jina Reranker v2',
    'SSE streaming responses',
  ],
  '/pipeline': [
    'Visual RAG pipeline diagram',
    'Step-by-step execution trace',
    'Latency breakdown per stage',
    'Retrieved chunks visualization',
  ],
  '/experiments': [
    'A/B test different RAG configurations',
    'Compare chunking strategies side-by-side',
    'Parameter sweep experiments',
    'Results comparison dashboard',
  ],
  '/costs': [
    'Token usage tracking per query',
    'Cost breakdown by model',
    'Usage trends over time',
    'Budget alerts and limits',
  ],
  '/evaluation': [
    'Automated answer quality scoring',
    'Faithfulness and relevance metrics',
    'Custom evaluation criteria',
    'Evaluation history and trends',
  ],
  '/chunking-playground': [
    'Interactive chunking experimentation',
    'Real-time chunk preview',
    'Side-by-side strategy comparison',
    'Chunk quality metrics',
  ],
};

export const DEFAULTS = {
  chunkStrategy: 'recursive' as const,
  chunkSize: 512,
  chunkOverlap: 50,
  maxFileSize: 50 * 1024 * 1024, // 50MB
};

export const QUERY_DEFAULTS = {
  searchMode: 'hybrid' as const,
  queryStrategy: 'direct' as const,
  rerankerEnabled: true,
  temperature: 0.1,
  retrievalTopK: 20,
  rerankerTopN: 5,
};

export const SEARCH_MODE_DESCRIPTIONS = {
  vector: 'Semantic similarity search using OpenAI embeddings. Best for meaning-based queries.',
  bm25: 'Keyword-based search using BM25 algorithm. Best for exact term matching.',
  hybrid: 'Combines vector and BM25 results using Reciprocal Rank Fusion. Best overall.',
} as const;

export const QUERY_STRATEGY_DESCRIPTIONS = {
  direct: 'Send the query directly to the retrieval pipeline without transformation.',
  hyde: 'Generate a Hypothetical Document Embedding — the LLM writes a hypothetical answer, then uses its embedding for retrieval.',
  multi_query: 'Generate multiple query variations to capture different perspectives and improve recall.',
  step_back: 'Rephrase the query at a higher abstraction level to retrieve broader context.',
} as const;
