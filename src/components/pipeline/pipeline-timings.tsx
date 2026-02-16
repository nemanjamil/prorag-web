import { Separator } from '@/components/ui/separator';
import { formatCost } from '@/lib/format';
import type { QueryLog } from '@/types/query';

interface PipelineTimingsProps {
  log: QueryLog;
}

interface TimingEntry {
  label: string;
  ms: number;
}

function TimingBar({ label, ms, total }: { label: string; ms: number; total: number }) {
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

export function PipelineTimings({ log }: PipelineTimingsProps) {
  const entries: TimingEntry[] = [
    { label: 'Transformation', ms: log.transformationMs ?? 0 },
    { label: 'Embedding', ms: log.queryEmbeddingMs ?? 0 },
    { label: 'Retrieval', ms: log.retrievalMs ?? 0 },
    { label: 'Reranking', ms: log.rerankingMs ?? 0 },
    { label: 'Generation', ms: log.generationMs ?? 0 },
  ];

  const total = entries.reduce((sum, e) => sum + e.ms, 0);

  return (
    <div className="space-y-3">
      {entries.map((e) => (
        <TimingBar key={e.label} label={e.label} ms={e.ms} total={total} />
      ))}
      <Separator />
      <div className="flex items-center justify-between text-sm font-medium">
        <span>Total Pipeline</span>
        <span className="font-mono">{(log.totalMs ?? 0).toFixed(0)}ms</span>
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
        <span className="text-muted-foreground">Embedding Tokens</span>
        <span className="font-mono">{log.embeddingTokens.toLocaleString()}</span>
        <span className="text-muted-foreground">Prompt Tokens</span>
        <span className="font-mono">{log.promptTokens.toLocaleString()}</span>
        <span className="text-muted-foreground">Completion Tokens</span>
        <span className="font-mono">{log.completionTokens.toLocaleString()}</span>
        <span className="text-muted-foreground">Estimated Cost</span>
        <span className="font-mono">{formatCost(log.estimatedCostUsd)}</span>
      </div>
    </div>
  );
}
