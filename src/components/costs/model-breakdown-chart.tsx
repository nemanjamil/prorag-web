import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatTokens } from '@/lib/format';
import type { ModelBreakdown } from '@/types/analytics';

interface ModelBreakdownChartProps {
  data: ModelBreakdown[] | undefined;
  isLoading: boolean;
}

export function ModelBreakdownChart({ data, isLoading }: ModelBreakdownChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Cost by Model</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : !data || data.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-sm text-muted-foreground">No data for this period</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="model"
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                tickFormatter={(v: number) => `$${v.toFixed(3)}`}
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                width={60}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.[0]) return null;
                  const item = payload[0].payload as ModelBreakdown;
                  return (
                    <div className="rounded-md border bg-popover p-3 text-sm text-popover-foreground shadow-md">
                      <p className="font-medium">{item.model}</p>
                      <p>Queries: {item.queryCount}</p>
                      <p>Total Cost: ${item.totalCostUsd.toFixed(4)}</p>
                      <p>Avg Cost: ${item.avgCostPerQuery.toFixed(4)}</p>
                      <p>Tokens: {formatTokens(item.totalTokens)}</p>
                    </div>
                  );
                }}
              />
              <Bar
                dataKey="totalCostUsd"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
