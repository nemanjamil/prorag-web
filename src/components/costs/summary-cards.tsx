import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCost, formatTokens, formatDuration } from '@/lib/format';
import type { AnalyticsSummary } from '@/types/analytics';

interface SummaryCardsProps {
  summary: AnalyticsSummary | undefined;
  isLoading: boolean;
}

export function SummaryCards({ summary, isLoading }: SummaryCardsProps) {
  const cards = [
    {
      title: 'Total Queries',
      value: summary ? String(summary.totalQueries) : '0',
    },
    {
      title: 'Total Cost',
      value: summary ? formatCost(summary.totalCostUsd) : '$0.00',
    },
    {
      title: 'Avg Cost / Query',
      value: summary ? formatCost(summary.avgCostPerQuery) : '$0.00',
    },
    {
      title: 'Total Tokens',
      value: summary
        ? formatTokens(
            summary.totalEmbeddingTokens +
              summary.totalPromptTokens +
              summary.totalCompletionTokens,
          )
        : '0',
      subtitle: summary
        ? `Avg latency: ${formatDuration(summary.avgLatencyMs)}`
        : undefined,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <p className="text-2xl font-bold">{card.value}</p>
                {card.subtitle && (
                  <p className="mt-1 text-xs text-muted-foreground">{card.subtitle}</p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
