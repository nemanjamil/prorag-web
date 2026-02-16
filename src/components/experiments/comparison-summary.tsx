import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ComparisonMetrics } from '@/types/query';

interface ComparisonSummaryProps {
  comparison: ComparisonMetrics;
}

export function ComparisonSummary({ comparison }: ComparisonSummaryProps) {
  const timingSign = comparison.timingDeltaMs > 0 ? '+' : '';
  const costSign = comparison.costDeltaUsd > 0 ? '+' : '';

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Comparison Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Timing Delta (A - B)</p>
            <Badge variant={comparison.timingDeltaMs > 0 ? 'destructive' : 'secondary'}>
              {timingSign}{comparison.timingDeltaMs}ms
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Cost Delta (A - B)</p>
            <Badge variant={comparison.costDeltaUsd > 0 ? 'destructive' : 'secondary'}>
              {costSign}${comparison.costDeltaUsd.toFixed(6)}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Chunk Overlap</p>
            <Badge variant="outline">
              {comparison.chunkOverlapCount} shared / {comparison.chunksACount}A, {comparison.chunksBCount}B
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
