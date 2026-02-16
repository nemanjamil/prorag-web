import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { ScoreCards } from './score-cards';
import { formatDate } from '@/lib/format';
import type { EvaluationDetail } from '@/types/evaluation';

interface EvaluationDetailPanelProps {
  detail: EvaluationDetail | undefined;
  isLoading: boolean;
}

export function EvaluationDetailPanel({ detail, isLoading }: EvaluationDetailPanelProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="space-y-4 pt-6">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!detail) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Evaluation Detail</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {detail.scores.evaluatorModel}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatDate(detail.scores.evaluatedAt)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScoreCards scores={detail.scores} reasoning={detail.reasoning} />

        <Separator />

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Query</h4>
          <p className="text-sm text-muted-foreground">{detail.queryText}</p>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Answer</h4>
          <ScrollArea className="h-48 rounded-md border p-3">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {detail.answerText}
            </p>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
