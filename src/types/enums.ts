export const ChunkStrategy = {
  FIXED: 'fixed',
  RECURSIVE: 'recursive',
  SEMANTIC: 'semantic',
} as const;
export type ChunkStrategy = (typeof ChunkStrategy)[keyof typeof ChunkStrategy];

export const DocumentStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  READY: 'ready',
  ERROR: 'error',
} as const;
export type DocumentStatus = (typeof DocumentStatus)[keyof typeof DocumentStatus];

export const SearchMode = {
  VECTOR: 'vector',
  BM25: 'bm25',
  HYBRID: 'hybrid',
} as const;
export type SearchMode = (typeof SearchMode)[keyof typeof SearchMode];

export const QueryStrategy = {
  DIRECT: 'direct',
  HYDE: 'hyde',
  MULTI_QUERY: 'multi_query',
  STEP_BACK: 'step_back',
} as const;
export type QueryStrategy = (typeof QueryStrategy)[keyof typeof QueryStrategy];
