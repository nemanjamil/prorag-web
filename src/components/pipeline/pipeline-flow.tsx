import { formatDuration } from '@/lib/format';
import type { QueryLog } from '@/types/query';

interface PipelineFlowProps {
  log: QueryLog;
}

interface FlowStep {
  label: string;
  ms: number | null;
  skipped: boolean;
}

export function PipelineFlow({ log }: PipelineFlowProps) {
  const steps: FlowStep[] = [
    { label: 'Query', ms: null, skipped: false },
    {
      label: 'Transform',
      ms: log.transformationMs,
      skipped: log.queryStrategy === 'direct',
    },
    { label: 'Embed', ms: log.queryEmbeddingMs, skipped: log.searchMode === 'bm25' },
    { label: 'Retrieve', ms: log.retrievalMs, skipped: false },
    {
      label: 'Rerank',
      ms: log.rerankingMs,
      skipped: !log.rerankerEnabled,
    },
    { label: 'Generate', ms: log.generationMs, skipped: false },
    { label: 'Answer', ms: null, skipped: false },
  ];

  return (
    <div className="flex items-center gap-1 overflow-x-auto py-2">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center">
          <div
            className={`flex flex-col items-center rounded-md border px-3 py-2 text-center ${
              step.skipped
                ? 'border-dashed border-muted-foreground/30 text-muted-foreground/50'
                : 'border-border bg-card'
            }`}
          >
            <span className={`text-xs font-medium ${step.skipped ? 'line-through' : ''}`}>
              {step.label}
            </span>
            {step.ms != null && (
              <span className="mt-0.5 text-[10px] font-mono text-muted-foreground">
                {formatDuration(step.ms)}
              </span>
            )}
          </div>
          {i < steps.length - 1 && (
            <div className="mx-1 h-px w-4 bg-border" />
          )}
        </div>
      ))}
    </div>
  );
}
