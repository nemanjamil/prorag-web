import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { PipelineMetadata, RetrievedChunk } from '@/types/query';
import { truncateText } from '@/lib/format';

interface QueryMetadataProps {
  metadata: PipelineMetadata;
  finalCostUsd: number | null;
  queryLogId: number | null;
}

export function QueryMetadata({ metadata, finalCostUsd, queryLogId }: QueryMetadataProps) {
  const { timings, retrievedChunks, settings, transformedQueries } = metadata;
  const totalRetrieval =
    timings.transformationMs + timings.embeddingMs + timings.retrievalMs + timings.rerankingMs;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Pipeline Metadata</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="timings">
          <TabsList>
            <TabsTrigger value="timings">Timings</TabsTrigger>
            <TabsTrigger value="chunks">
              Chunks ({retrievedChunks.length})
            </TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="timings" className="mt-4 space-y-3">
            <TimingsPanel timings={timings} totalRetrieval={totalRetrieval} />
          </TabsContent>

          <TabsContent value="chunks" className="mt-4">
            <ChunksPanel chunks={retrievedChunks} />
          </TabsContent>

          <TabsContent value="details" className="mt-4 space-y-4">
            <DetailsPanel
              settings={settings}
              transformedQueries={transformedQueries}
              finalCostUsd={finalCostUsd}
              queryLogId={queryLogId}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function TimingRow({ label, ms, total }: { label: string; ms: number; total: number }) {
  const pct = total > 0 ? (ms / total) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span>{label}</span>
        <span className="font-mono text-muted-foreground">{ms.toFixed(0)}ms</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${Math.max(pct, 1)}%` }}
        />
      </div>
    </div>
  );
}

function TimingsPanel({
  timings,
  totalRetrieval,
}: {
  timings: PipelineMetadata['timings'];
  totalRetrieval: number;
}) {
  return (
    <>
      <TimingRow label="Query Transformation" ms={timings.transformationMs} total={totalRetrieval} />
      <TimingRow label="Embedding" ms={timings.embeddingMs} total={totalRetrieval} />
      <TimingRow label="Retrieval" ms={timings.retrievalMs} total={totalRetrieval} />
      <TimingRow label="Reranking" ms={timings.rerankingMs} total={totalRetrieval} />
      <Separator />
      <div className="flex items-center justify-between text-sm font-medium">
        <span>Total (pre-generation)</span>
        <span className="font-mono">{totalRetrieval.toFixed(0)}ms</span>
      </div>
    </>
  );
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

function ChunksPanel({ chunks }: { chunks: RetrievedChunk[] }) {
  if (chunks.length === 0) {
    return <p className="text-sm text-muted-foreground">No chunks retrieved</p>;
  }
  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-2 pr-3">
        {chunks.map((chunk, i) => (
          <ChunkCard key={`${chunk.documentId}-${chunk.chunkIndex}`} chunk={chunk} index={i} />
        ))}
      </div>
    </ScrollArea>
  );
}

function DetailsPanel({
  settings,
  transformedQueries,
  finalCostUsd,
  queryLogId,
}: {
  settings: PipelineMetadata['settings'];
  transformedQueries: string[];
  finalCostUsd: number | null;
  queryLogId: number | null;
}) {
  return (
    <>
      <div>
        <h4 className="mb-2 text-sm font-medium">Pipeline Settings</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
          <span className="text-muted-foreground">Search Mode</span>
          <span className="capitalize">{settings.searchMode}</span>
          <span className="text-muted-foreground">Query Strategy</span>
          <span className="capitalize">{settings.queryStrategy.replace('_', ' ')}</span>
          <span className="text-muted-foreground">LLM Model</span>
          <span>{settings.llmModel}</span>
          <span className="text-muted-foreground">Temperature</span>
          <span>{settings.temperature}</span>
          <span className="text-muted-foreground">Retrieval Top K</span>
          <span>{settings.retrievalTopK}</span>
          <span className="text-muted-foreground">Reranker</span>
          <span>{settings.rerankerEnabled ? `Enabled (Top ${settings.rerankerTopN})` : 'Disabled'}</span>
          {queryLogId != null && (
            <>
              <span className="text-muted-foreground">Query Log ID</span>
              <span>#{queryLogId}</span>
            </>
          )}
          {finalCostUsd != null && (
            <>
              <span className="text-muted-foreground">Estimated Cost</span>
              <span>${finalCostUsd.toFixed(4)}</span>
            </>
          )}
        </div>
      </div>

      {transformedQueries.length > 0 && (
        <>
          <Separator />
          <div>
            <h4 className="mb-2 text-sm font-medium">Transformed Queries</h4>
            <div className="space-y-2">
              {transformedQueries.map((q, i) => (
                <div key={i} className="rounded-md bg-muted/50 p-2.5">
                  <p className="text-xs text-muted-foreground">Query {i + 1}</p>
                  <p className="text-sm">{q}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
