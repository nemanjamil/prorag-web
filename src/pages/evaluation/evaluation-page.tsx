import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQueryLogs } from '@/hooks/use-query-logs';
import { useEvaluatedLogs, useEvaluationDetail } from '@/hooks/use-evaluation';
import { EvaluationHistoryTable } from '@/components/evaluation/evaluation-history-table';
import { EvaluationDetailPanel } from '@/components/evaluation/evaluation-detail-panel';
import { RunEvaluationButton } from '@/components/evaluation/run-evaluation-button';
import { ScoreCards } from '@/components/evaluation/score-cards';
import { truncateText } from '@/lib/format';
import type { EvaluationDetail } from '@/types/evaluation';

export function EvaluationPage() {
  const [selectedLogId, setSelectedLogId] = useState<number | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationDetail | null>(null);
  const [logPage, setLogPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);
  const [historySelectedId, setHistorySelectedId] = useState<number | null>(null);

  const { data: queryLogs, isLoading: logsLoading } = useQueryLogs(logPage, 10);
  const { data: evaluatedLogs, isLoading: historyLoading } = useEvaluatedLogs(historyPage, 10);
  const { data: historyDetail, isLoading: detailLoading } = useEvaluationDetail(historySelectedId);

  const handleEvaluationComplete = (detail: EvaluationDetail) => {
    setEvaluationResult(detail);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Evaluation</h1>
        <p className="text-muted-foreground">
          Evaluate RAG answer quality using LLM-as-judge scoring for faithfulness, relevance, and
          completeness.
        </p>
      </div>

      <Tabs defaultValue="evaluate">
        <TabsList>
          <TabsTrigger value="evaluate">Evaluate</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="evaluate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Select a Query Log</CardTitle>
              <CardDescription>
                Choose a completed query to evaluate its answer quality.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Select
                  value={selectedLogId?.toString() ?? ''}
                  onValueChange={(v) => {
                    setSelectedLogId(Number(v));
                    setEvaluationResult(null);
                  }}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a query log..." />
                  </SelectTrigger>
                  <SelectContent>
                    {queryLogs?.data.map((log) => (
                      <SelectItem key={log.id} value={log.id.toString()}>
                        #{log.id} — {truncateText(log.queryText, 60)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <RunEvaluationButton
                  queryLogId={selectedLogId}
                  onComplete={handleEvaluationComplete}
                />
              </div>

              {!logsLoading && queryLogs && queryLogs.total > 10 && (
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={logPage <= 1}
                    onClick={() => setLogPage((p) => p - 1)}
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {logPage} of {Math.ceil(queryLogs.total / 10)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={logPage >= Math.ceil(queryLogs.total / 10)}
                    onClick={() => setLogPage((p) => p + 1)}
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {evaluationResult && (
            <div className="space-y-4">
              <ScoreCards scores={evaluationResult.scores} reasoning={evaluationResult.reasoning} />
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Answer</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {evaluationResult.answerText}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <EvaluationHistoryTable
            logs={evaluatedLogs?.data}
            isLoading={historyLoading}
            selectedId={historySelectedId}
            onSelect={setHistorySelectedId}
          />

          {!historyLoading && evaluatedLogs && evaluatedLogs.total > 10 && (
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={historyPage <= 1}
                onClick={() => setHistoryPage((p) => p - 1)}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {historyPage} of {Math.ceil(evaluatedLogs.total / 10)}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={historyPage >= Math.ceil(evaluatedLogs.total / 10)}
                onClick={() => setHistoryPage((p) => p + 1)}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          )}

          {historySelectedId && (
            <EvaluationDetailPanel detail={historyDetail} isLoading={detailLoading} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
