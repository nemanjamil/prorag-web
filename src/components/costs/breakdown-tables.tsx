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
import { formatCost, formatDuration } from '@/lib/format';
import type { StrategyBreakdown, SearchModeBreakdown } from '@/types/analytics';

interface BreakdownTablesProps {
  byStrategy: StrategyBreakdown[] | undefined;
  bySearchMode: SearchModeBreakdown[] | undefined;
  isLoading: boolean;
}

export function BreakdownTables({ byStrategy, bySearchMode, isLoading }: BreakdownTablesProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">By Strategy</CardTitle></CardHeader>
          <CardContent><Skeleton className="h-40 w-full" /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">By Search Mode</CardTitle></CardHeader>
          <CardContent><Skeleton className="h-40 w-full" /></CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">By Strategy</CardTitle>
        </CardHeader>
        <CardContent>
          {!byStrategy || byStrategy.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Strategy</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                  <TableHead className="text-right">Total Cost</TableHead>
                  <TableHead className="text-right">Avg Latency</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {byStrategy.map((row) => (
                  <TableRow key={row.strategy}>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {row.strategy.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">{row.queryCount}</TableCell>
                    <TableCell className="text-right font-mono">{formatCost(row.totalCostUsd)}</TableCell>
                    <TableCell className="text-right font-mono">{formatDuration(row.avgLatencyMs)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">By Search Mode</CardTitle>
        </CardHeader>
        <CardContent>
          {!bySearchMode || bySearchMode.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Search Mode</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                  <TableHead className="text-right">Total Cost</TableHead>
                  <TableHead className="text-right">Avg Latency</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bySearchMode.map((row) => (
                  <TableRow key={row.searchMode}>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {row.searchMode}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">{row.queryCount}</TableCell>
                    <TableCell className="text-right font-mono">{formatCost(row.totalCostUsd)}</TableCell>
                    <TableCell className="text-right font-mono">{formatDuration(row.avgLatencyMs)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
