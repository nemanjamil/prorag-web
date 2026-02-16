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
import { formatDate, formatDuration, formatCost, truncateText } from '@/lib/format';
import type { QueryLogSummary } from '@/types/query';

interface QueryLogTableProps {
  logs: QueryLogSummary[] | undefined;
  isLoading: boolean;
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export function QueryLogTable({ logs, isLoading, selectedId, onSelect }: QueryLogTableProps) {
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
          No query logs yet. Run some queries first!
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Query</TableHead>
            <TableHead>Strategy</TableHead>
            <TableHead>Search</TableHead>
            <TableHead className="text-right">Duration</TableHead>
            <TableHead className="text-right">Cost</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow
              key={log.id}
              className={`cursor-pointer ${selectedId === log.id ? 'bg-muted/50' : ''}`}
              onClick={() => onSelect(log.id)}
            >
              <TableCell className="font-medium">
                {truncateText(log.queryText, 80)}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs capitalize">
                  {log.queryStrategy.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="text-xs capitalize">
                  {log.searchMode}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-mono text-sm">
                {formatDuration(log.totalMs)}
              </TableCell>
              <TableCell className="text-right font-mono text-sm">
                {formatCost(log.estimatedCostUsd)}
              </TableCell>
              <TableCell className="text-right text-sm text-muted-foreground">
                {formatDate(log.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
