import { useState } from 'react';
import { Play } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChunkingControls } from './chunking-controls';
import { ChunkViewer } from '@/components/documents/chunk-viewer';
import { ChunkStats } from '@/components/documents/chunk-stats';
import { usePreviewChunks } from '@/hooks/use-preview-chunks';
import { ChunkStrategy } from '@/types/enums';
import { DEFAULTS } from '@/lib/constants';
import type { Chunk, ChunkStats as ChunkStatsType } from '@/types/document';

interface ComparisonPanelProps {
  documentId: number | null;
  label?: string;
}

export function ComparisonPanel({ documentId, label }: ComparisonPanelProps) {
  const [strategy, setStrategy] = useState<ChunkStrategy>(ChunkStrategy.RECURSIVE);
  const [chunkSize, setChunkSize] = useState(DEFAULTS.chunkSize);
  const [chunkOverlap, setChunkOverlap] = useState(DEFAULTS.chunkOverlap);
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [stats, setStats] = useState<ChunkStatsType | null>(null);

  const previewMutation = usePreviewChunks(documentId ?? 0);

  function handlePreview() {
    if (!documentId) return;

    const isSemantic = strategy === ChunkStrategy.SEMANTIC;
    previewMutation.mutate(
      {
        strategy,
        chunkSize,
        chunkOverlap: isSemantic ? 0 : chunkOverlap,
      },
      {
        onSuccess: (data) => {
          setChunks(data.chunks);
          setStats(data.stats);
        },
        onError: (error) => {
          toast.error(`Preview failed: ${error.message}`);
        },
      },
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{label ?? 'Chunking Preview'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ChunkingControls
          strategy={strategy}
          chunkSize={chunkSize}
          chunkOverlap={chunkOverlap}
          onStrategyChange={setStrategy}
          onChunkSizeChange={setChunkSize}
          onChunkOverlapChange={setChunkOverlap}
        />

        <Button
          onClick={handlePreview}
          disabled={!documentId || previewMutation.isPending}
        >
          {previewMutation.isPending ? (
            <>
              <span className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Chunking…
            </>
          ) : (
            <>
              <Play className="mr-2 size-4" />
              Preview Chunks
            </>
          )}
        </Button>

        {(stats || previewMutation.isPending) && (
          <ChunkStats
            chunks={chunks.length ? chunks : undefined}
            isLoading={previewMutation.isPending}
          />
        )}

        {(chunks.length > 0 || previewMutation.isPending) && (
          <ChunkViewer
            chunks={chunks}
            isLoading={previewMutation.isPending}
            totalChunks={chunks.length}
          />
        )}
      </CardContent>
    </Card>
  );
}
