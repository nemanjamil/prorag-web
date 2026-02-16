import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SummaryCards } from '@/components/costs/summary-cards';
import { CostTrendChart } from '@/components/costs/cost-trend-chart';
import { ModelBreakdownChart } from '@/components/costs/model-breakdown-chart';
import { BreakdownTables } from '@/components/costs/breakdown-tables';
import { RecentQueriesTable } from '@/components/costs/recent-queries-table';
import { useAnalytics } from '@/hooks/use-analytics';

const PERIOD_OPTIONS = [
  { value: '7', label: 'Last 7 days' },
  { value: '14', label: 'Last 14 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 90 days' },
];

export function CostsPage() {
  const [days, setDays] = useState(30);
  const { data, isLoading } = useAnalytics(days);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cost Analytics</h1>
          <p className="text-muted-foreground">
            Monitor token usage and costs across your RAG queries.
          </p>
        </div>
        <Select value={String(days)} onValueChange={(v) => setDays(Number(v))}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PERIOD_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <SummaryCards summary={data?.summary} isLoading={isLoading} />

      {/* Daily Cost Trend */}
      <CostTrendChart data={data?.dailyTrend} isLoading={isLoading} />

      {/* Model Breakdown + Strategy/Search Tables */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ModelBreakdownChart data={data?.byModel} isLoading={isLoading} />
        <BreakdownTables
          byStrategy={data?.byStrategy}
          bySearchMode={data?.bySearchMode}
          isLoading={isLoading}
        />
      </div>

      {/* Recent Queries */}
      <RecentQueriesTable />
    </div>
  );
}
