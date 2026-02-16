import type { ChunkStrategy, DocumentStatus } from './enums';

export interface Document {
  id: number;
  originalFilename: string;
  storagePath: string;
  fileSizeBytes: number;
  pageCount: number | null;
  chunkCount: number;
  chunkStrategy: ChunkStrategy;
  chunkSize: number;
  chunkOverlap: number;
  qdrantCollection: string;
  status: DocumentStatus;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Chunk {
  text: string;
  chunkIndex: number;
  pageNumber: number | null;
  startChar: number;
  endChar: number;
}

export interface UploadDocumentParams {
  file: File;
  chunkStrategy: ChunkStrategy;
  chunkSize: number;
  chunkOverlap: number;
}

export interface UploadDocumentResponse {
  document: Document;
  chunks: Chunk[];
}

export interface PreviewChunksParams {
  strategy: ChunkStrategy;
  chunkSize: number;
  chunkOverlap: number;
}

export interface ChunkStats {
  count: number;
  avgLength: number;
  minLength: number;
  maxLength: number;
  totalChars: number;
}

export interface PreviewChunksResponse {
  chunks: Chunk[];
  stats: ChunkStats;
}
