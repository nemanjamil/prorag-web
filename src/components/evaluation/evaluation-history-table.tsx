import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScoreBadge } from './score-badge';
import { formatDate, formatCost, truncateText } from '@/lib/format';
import type { EvaluatedQueryLog } from '@/types/evaluation';

interface EvaluationHistoryTableProps {
  logs: EvaluatedQueryLog[] | undefined;
  isLoading: boolean;
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export function EvaluationHistoryTable({
  logs,
  isLoading,
  selectedId,
  onSelect,
}: EvaluationHistoryTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
        <p className="text-sm text-muted-foreground">
          No evaluated queries yet. Run an evaluation first!
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30%]">Query</TableHead>
            <TableHead>Model</TableHead>
            <TableHead className="text-center">Faith.</TableHead>
            <TableHead className="text-center">Relev.</TableHead>
            <TableHead className="text-center">Compl.</TableHead>
            <TableHead className="text-center">Overall</TableHead>
            <TableHead className="text-right">Cost</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => {
            const scores = log.evaluationScores;
            return (
              <TableRow
                key={log.id}
                className={`cursor-pointer ${selectedId === log.id ? 'bg-muted/50' : ''}`}
                onClick={() => onSelect(log.id)}
              >
                <TableCell className="font-medium">
                  {truncateText(log.queryText, 60)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {log.llmModel}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <ScoreBadge score={scores.faithfulness} />
                </TableCell>
                <TableCell className="text-center">
                  <ScoreBadge score={scores.relevance} />
                </TableCell>
                <TableCell className="text-center">
                  <ScoreBadge score={scores.completeness} />
                </TableCell>
                <TableCell className="text-center">
                  <ScoreBadge score={scores.overallScore} />
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {formatCost(log.estimatedCostUsd)}
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {formatDate(log.createdAt)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
