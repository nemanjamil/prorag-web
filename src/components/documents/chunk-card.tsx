import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { truncateText } from '@/lib/format';
import type { Chunk } from '@/types/document';

interface ChunkCardProps {
  chunk: Chunk;
  isSelected: boolean;
  onClick: () => void;
}

export function ChunkCard({ chunk, isSelected, onClick }: ChunkCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left rounded-md border p-3 transition-colors hover:bg-accent',
        isSelected && 'border-primary bg-accent',
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium">Chunk {chunk.chunkIndex}</span>
        <div className="flex items-center gap-1.5">
          {chunk.pageNumber !== null && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              p.{chunk.pageNumber}
            </Badge>
          )}
          <span className="text-[10px] text-muted-foreground">
            {chunk.text.length} chars
          </span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {truncateText(chunk.text, 120)}
      </p>
    </button>
  );
}
