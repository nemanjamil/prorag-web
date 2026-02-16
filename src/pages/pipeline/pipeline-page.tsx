import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { QueryLogTable } from '@/components/pipeline/query-log-table';
import { PipelineDetail } from '@/components/pipeline/pipeline-detail';
import { useQueryLogs, useQueryLog } from '@/hooks/use-query-logs';

const PAGE_SIZE = 20;

export function PipelinePage() {
  const [page, setPage] = useState(1);
  const [selectedLogId, setSelectedLogId] = useState<number | null>(null);

  const { data: logsData, isLoading: logsLoading } = useQueryLogs(page, PAGE_SIZE);
  const { data: selectedLog, isLoading: logLoading } = useQueryLog(selectedLogId);

  const totalPages = logsData ? Math.ceil(logsData.total / logsData.limit) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pipeline Visualizer</h1>
        <p className="text-muted-foreground">
          Browse past query executions and inspect the full pipeline trace.
        </p>
      </div>

      <QueryLogTable
        logs={logsData?.data}
        isLoading={logsLoading}
        selectedId={selectedLogId}
        onSelect={setSelectedLogId}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages} ({logsData?.total} total)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {selectedLogId !== null && (
        <PipelineDetail
          log={selectedLog}
          isLoading={logLoading}
          onClose={() => setSelectedLogId(null)}
        />
      )}
    </div>
  );
}
