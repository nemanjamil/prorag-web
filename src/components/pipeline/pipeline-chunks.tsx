import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { truncateText } from '@/lib/format';
import type { RetrievedChunk } from '@/types/query';

interface PipelineChunksProps {
  chunks: RetrievedChunk[] | null;
}

function ChunkCard({ chunk, index }: { chunk: RetrievedChunk; index: number }) {
  return (
    <div className="space-y-2 rounded-md border p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">#{index + 1}</span>
          <Badge variant="outline" className="text-xs">
            Doc {chunk.documentId}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Chunk {chunk.chunkIndex}
          </Badge>
          {chunk.pageNumber != null && (
            <Badge variant="outline" className="text-xs">
              p.{chunk.pageNumber}
            </Badge>
          )}
        </div>
        <Badge variant="secondary" className="text-xs capitalize">
          {chunk.source}
        </Badge>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {truncateText(chunk.text, 300)}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {chunk.vectorScore != null && (
          <Badge variant="outline" className="text-[10px] font-normal">
            Vector: {chunk.vectorScore.toFixed(3)}
          </Badge>
        )}
        {chunk.bm25Score != null && (
          <Badge variant="outline" className="text-[10px] font-normal">
            BM25: {chunk.bm25Score.toFixed(3)}
          </Badge>
        )}
        {chunk.rrfScore != null && (
          <Badge variant="outline" className="text-[10px] font-normal">
            RRF: {chunk.rrfScore.toFixed(4)}
          </Badge>
        )}
        {chunk.rerankerScore != null && (
          <Badge variant="outline" className="text-[10px] font-normal">
            Reranker: {chunk.rerankerScore.toFixed(3)}
          </Badge>
        )}
      </div>
    </div>
  );
}

export function PipelineChunks({ chunks }: PipelineChunksProps) {
  if (!chunks || chunks.length === 0) {
    return <p className="text-sm text-muted-foreground">No chunks retrieved</p>;
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-2 pr-3">
        {chunks.map((chunk, i) => (
          <ChunkCard
            key={`${chunk.documentId}-${chunk.chunkIndex}`}
            chunk={chunk}
            index={i}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
