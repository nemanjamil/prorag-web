import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { DailyCostTrend } from '@/types/analytics';

interface CostTrendChartProps {
  data: DailyCostTrend[] | undefined;
  isLoading: boolean;
}

function formatDateLabel(value: string): string {
  const d = new Date(value.includes('T') ? value : value + 'T00:00:00');
  if (isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function CostTrendChart({ data, isLoading }: CostTrendChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Daily Cost Trend</CardTitle>
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
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDateLabel}
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
                content={({ active, payload, label }) => {
                  if (!active || !payload?.[0]) return null;
                  const item = payload[0].payload as DailyCostTrend;
                  return (
                    <div className="rounded-md border bg-popover p-3 text-sm text-popover-foreground shadow-md">
                      <p className="font-medium">{formatDateLabel(String(label))}</p>
                      <p>Cost: ${item.totalCostUsd.toFixed(4)}</p>
                      <p>Queries: {item.queryCount}</p>
                    </div>
                  );
                }}
              />
              <Area
                type="monotone"
                dataKey="totalCostUsd"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary) / 0.2)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
