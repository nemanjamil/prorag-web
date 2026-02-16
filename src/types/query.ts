import type { QueryStrategy, SearchMode } from './enums';

export interface RetrievedChunk {
  documentId: number;
  chunkIndex: number;
  pageNumber: number | null;
  text: string;
  chunkStrategy: string;
  vectorRank: number | null;
  vectorScore: number | null;
  bm25Rank: number | null;
  bm25Score: number | null;
  rrfScore: number | null;
  rerankerScore: number | null;
  source: 'vector' | 'bm25' | 'both';
}

export interface PipelineSettings {
  searchMode: SearchMode;
  queryStrategy: QueryStrategy;
  rerankerEnabled: boolean;
  temperature: number;
  retrievalTopK: number;
  rerankerTopN: number;
  documentIds: number[] | null;
  promptTemplateId: number | null;
  llmModel: string;
}

export interface PipelineTimings {
  transformationMs: number;
  embeddingMs: number;
  retrievalMs: number;
  rerankingMs: number;
}

export interface PipelineMetadata {
  timings: PipelineTimings;
  retrievedChunks: RetrievedChunk[];
  settings: PipelineSettings;
  transformedQueries: string[];
}

export type SseEvent =
  | { type: 'metadata'; data: PipelineMetadata }
  | { type: 'token'; data: { token: string } }
  | { type: 'done'; data: { answerText: string; queryLogId: number; finalCostUsd: number } }
  | { type: 'error'; data: { message: string } };

export interface QueryRequest {
  queryText: string;
  searchMode?: SearchMode;
  queryStrategy?: QueryStrategy;
  rerankerEnabled?: boolean;
  temperature?: number;
  retrievalTopK?: number;
  rerankerTopN?: number;
  documentIds?: number[];
  promptTemplateId?: number;
}

export interface QueryLog {
  id: number;
  queryText: string;
  answerText: string | null;
  queryStrategy: QueryStrategy;
  searchMode: SearchMode;
  rerankerEnabled: boolean;
  temperature: number;
  retrievalTopK: number;
  rerankerTopN: number;
  llmModel: string;
  promptTemplateId: number | null;
  queryEmbeddingMs: number | null;
  retrievalMs: number | null;
  rerankingMs: number | null;
  generationMs: number | null;
  totalMs: number | null;
  embeddingTokens: number;
  promptTokens: number;
  completionTokens: number;
  estimatedCostUsd: number;
  retrievedChunks: unknown;
  evaluationScores: unknown;
  createdAt: string;
}

export interface PromptTemplate {
  id: number;
  name: string;
  systemPrompt: string;
  description: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}
