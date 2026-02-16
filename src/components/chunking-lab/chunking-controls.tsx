import { Info } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ChunkStrategy } from '@/types/enums';
import { CHUNK_STRATEGY_DESCRIPTIONS } from '@/lib/constants';

interface ChunkingControlsProps {
  strategy: ChunkStrategy;
  chunkSize: number;
  chunkOverlap: number;
  onStrategyChange: (strategy: ChunkStrategy) => void;
  onChunkSizeChange: (size: number) => void;
  onChunkOverlapChange: (overlap: number) => void;
}

export function ChunkingControls({
  strategy,
  chunkSize,
  chunkOverlap,
  onStrategyChange,
  onChunkSizeChange,
  onChunkOverlapChange,
}: ChunkingControlsProps) {
  const isSemantic = strategy === ChunkStrategy.SEMANTIC;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>Chunking Strategy</Label>
          <Select value={strategy} onValueChange={(v) => onStrategyChange(v as ChunkStrategy)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ChunkStrategy.FIXED}>Fixed</SelectItem>
              <SelectItem value={ChunkStrategy.RECURSIVE}>Recursive</SelectItem>
              <SelectItem value={ChunkStrategy.SEMANTIC}>Semantic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Chunk Size: {chunkSize}</Label>
          <Slider
            value={[chunkSize]}
            onValueChange={([v]) => onChunkSizeChange(v)}
            min={100}
            max={4000}
            step={50}
          />
          <p className="text-xs text-muted-foreground">100 – 4,000 characters</p>
        </div>

        <div className="space-y-2">
          <Label className={isSemantic ? 'text-muted-foreground' : ''}>
            Chunk Overlap: {isSemantic ? '—' : chunkOverlap}
          </Label>
          <Slider
            value={[chunkOverlap]}
            onValueChange={([v]) => onChunkOverlapChange(v)}
            min={0}
            max={500}
            step={10}
            disabled={isSemantic}
          />
          <p className="text-xs text-muted-foreground">
            {isSemantic ? 'Not applicable for semantic chunking' : '0 – 500 characters'}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-md bg-muted/50 p-3">
        <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          <span className="font-medium capitalize">{strategy}:</span>{' '}
          {CHUNK_STRATEGY_DESCRIPTIONS[strategy]}
        </p>
      </div>
    </div>
  );
}
