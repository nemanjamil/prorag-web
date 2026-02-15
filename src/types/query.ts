import type { QueryStrategy, SearchMode } from './enums';

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
