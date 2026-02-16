import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { QueryLog } from '@/types/query';
import { formatCost } from '@/lib/format';

interface ComparisonResultCardProps {
  title: string;
  log: QueryLog;
}

export function ComparisonResultCard({ title, log }: ComparisonResultCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline">{log.searchMode}</Badge>
          <Badge variant="outline">{log.queryStrategy}</Badge>
          {log.rerankerEnabled && <Badge variant="outline">reranker</Badge>}
          <Badge variant="outline">temp {Number(log.temperature).toFixed(1)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Timing Breakdown */}
        <div className="space-y-1">
          <p className="text-xs font-medium">Timing Breakdown</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
            <span>Transform</span>
            <span className="text-right">{log.transformationMs ?? 0}ms</span>
            <span>Embed</span>
            <span className="text-right">{log.queryEmbeddingMs ?? 0}ms</span>
            <span>Retrieve</span>
            <span className="text-right">{log.retrievalMs ?? 0}ms</span>
            <span>Rerank</span>
            <span className="text-right">{log.rerankingMs ?? 0}ms</span>
            <span>Generate</span>
            <span className="text-right">{log.generationMs ?? 0}ms</span>
            <span className="font-medium text-foreground">Total</span>
            <span className="text-right font-medium text-foreground">{log.totalMs ?? 0}ms</span>
          </div>
        </div>

        <Separator />

        {/* Token Counts & Cost */}
        <div className="space-y-1">
          <p className="text-xs font-medium">Tokens & Cost</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
            <span>Embedding tokens</span>
            <span className="text-right">{log.embeddingTokens}</span>
            <span>Prompt tokens</span>
            <span className="text-right">{log.promptTokens}</span>
            <span>Completion tokens</span>
            <span className="text-right">{log.completionTokens}</span>
            <span className="font-medium text-foreground">Cost</span>
            <span className="text-right font-medium text-foreground">
              {formatCost(Number(log.estimatedCostUsd))}
            </span>
          </div>
        </div>

        <Separator />

        {/* Retrieved Chunks Count */}
        <p className="text-xs text-muted-foreground">
          Retrieved chunks: {Array.isArray(log.retrievedChunks) ? log.retrievedChunks.length : 0}
        </p>

        <Separator />

        {/* Answer */}
        <div className="space-y-1">
          <p className="text-xs font-medium">Answer</p>
          <ScrollArea className="h-48 rounded-md border p-3">
            <p className="whitespace-pre-wrap text-sm">{log.answerText}</p>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
