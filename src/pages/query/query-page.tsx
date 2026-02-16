import { useState, useCallback } from 'react';
import { QueryInput } from '@/components/query/query-input';
import { QuerySettings } from '@/components/query/query-settings';
import { QueryAnswer } from '@/components/query/query-answer';
import { QueryMetadata } from '@/components/query/query-metadata';
import { useQueryPipeline } from '@/hooks/use-query-pipeline';
import { QUERY_DEFAULTS } from '@/lib/constants';
import type { PipelineSettings, QueryRequest } from '@/types/query';

export function QueryPage() {
  const pipeline = useQueryPipeline();

  const [settings, setSettings] = useState<PipelineSettings>({
    searchMode: QUERY_DEFAULTS.searchMode,
    queryStrategy: QUERY_DEFAULTS.queryStrategy,
    rerankerEnabled: QUERY_DEFAULTS.rerankerEnabled,
    temperature: QUERY_DEFAULTS.temperature,
    retrievalTopK: QUERY_DEFAULTS.retrievalTopK,
    rerankerTopN: QUERY_DEFAULTS.rerankerTopN,
    documentIds: null,
    promptTemplateId: null,
    llmModel: '',
  });

  const handleSettingsChange = useCallback((patch: Partial<PipelineSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleSubmit = useCallback(
    (queryText: string) => {
      const request: QueryRequest = {
        queryText,
        searchMode: settings.searchMode,
        queryStrategy: settings.queryStrategy,
        rerankerEnabled: settings.rerankerEnabled,
        temperature: settings.temperature,
        retrievalTopK: settings.retrievalTopK,
        rerankerTopN: settings.rerankerTopN,
      };
      if (settings.documentIds && settings.documentIds.length > 0) {
        request.documentIds = settings.documentIds;
      }
      if (settings.promptTemplateId) {
        request.promptTemplateId = settings.promptTemplateId;
      }
      pipeline.execute(request);
    },
    [settings, pipeline.execute],
  );

  const isStreaming = pipeline.status === 'streaming';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Query Interface</h1>
        <p className="text-muted-foreground">
          Ask questions against your uploaded documents using different RAG strategies.
        </p>
      </div>

      {/* Input + Settings */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <QueryInput
          onSubmit={handleSubmit}
          onCancel={pipeline.cancel}
          isStreaming={isStreaming}
        />
        <QuerySettings
          settings={settings}
          onChange={handleSettingsChange}
          disabled={isStreaming}
        />
      </div>

      {/* Answer */}
      {pipeline.status !== 'idle' && (
        <QueryAnswer
          status={pipeline.status}
          answer={pipeline.answer}
          error={pipeline.error}
          finalCostUsd={pipeline.finalCostUsd}
          queryLogId={pipeline.queryLogId}
        />
      )}

      {/* Metadata */}
      {pipeline.metadata && (
        <QueryMetadata
          metadata={pipeline.metadata}
          finalCostUsd={pipeline.finalCostUsd}
          queryLogId={pipeline.queryLogId}
        />
      )}
    </div>
  );
}
