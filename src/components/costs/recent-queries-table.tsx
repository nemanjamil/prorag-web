import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCost, formatDate, formatTokens, truncateText } from '@/lib/format';
import { useQueryLogs } from '@/hooks/use-query-logs';

export function RecentQueriesTable() {
  const { data, isLoading } = useQueryLogs(1, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Queries (Token Breakdown)</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-60 w-full" />
        ) : !data || data.data.length === 0 ? (
          <p className="text-sm text-muted-foreground">No queries yet</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Query</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead className="text-right">Embed</TableHead>
                  <TableHead className="text-right">Prompt</TableHead>
                  <TableHead className="text-right">Completion</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">
                      {truncateText(log.queryText, 60)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {log.llmModel}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {formatTokens(log.embeddingTokens)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {formatTokens(log.promptTokens)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {formatTokens(log.completionTokens)}
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
        )}
      </CardContent>
    </Card>
  );
}
