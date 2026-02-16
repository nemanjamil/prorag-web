import { Separator } from '@/components/ui/separator';
import type { QueryLog } from '@/types/query';

interface PipelineSettingsProps {
  log: QueryLog;
}

export function PipelineSettings({ log }: PipelineSettingsProps) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="mb-2 text-sm font-medium">Pipeline Settings</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
          <span className="text-muted-foreground">Search Mode</span>
          <span className="capitalize">{log.searchMode}</span>
          <span className="text-muted-foreground">Query Strategy</span>
          <span className="capitalize">{log.queryStrategy.replace('_', ' ')}</span>
          <span className="text-muted-foreground">LLM Model</span>
          <span>{log.llmModel}</span>
          <span className="text-muted-foreground">Temperature</span>
          <span>{log.temperature}</span>
          <span className="text-muted-foreground">Retrieval Top K</span>
          <span>{log.retrievalTopK}</span>
          <span className="text-muted-foreground">Reranker</span>
          <span>
            {log.rerankerEnabled ? `Enabled (Top ${log.rerankerTopN})` : 'Disabled'}
          </span>
          <span className="text-muted-foreground">Prompt Template ID</span>
          <span>{log.promptTemplateId ?? 'Default'}</span>
        </div>
      </div>

      {log.transformedQueries && log.transformedQueries.length > 0 && (
        <>
          <Separator />
          <div>
            <h4 className="mb-2 text-sm font-medium">Transformed Queries</h4>
            <div className="space-y-2">
              {log.transformedQueries.map((q, i) => (
                <div key={i} className="rounded-md bg-muted/50 p-2.5">
                  <p className="text-xs text-muted-foreground">Query {i + 1}</p>
                  <p className="text-sm">{q}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
