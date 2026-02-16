import { MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface QueryAnswerProps {
  status: 'idle' | 'streaming' | 'done' | 'error';
  answer: string;
  error: string | null;
  finalCostUsd: number | null;
  queryLogId: number | null;
}

export function QueryAnswer({ status, answer, error, finalCostUsd, queryLogId }: QueryAnswerProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Answer</CardTitle>
          <div className="flex items-center gap-2">
            {status === 'done' && queryLogId != null && (
              <Badge variant="outline" className="text-xs font-normal">
                Log #{queryLogId}
              </Badge>
            )}
            {status === 'done' && finalCostUsd != null && (
              <Badge variant="secondary" className="text-xs font-normal">
                ${finalCostUsd.toFixed(4)}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {status === 'idle' && (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
            <MessageSquare className="size-8" />
            <p className="text-sm">Ask a question to get started</p>
          </div>
        )}

        {status === 'error' && (
          <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
            {error || 'An unexpected error occurred'}
          </div>
        )}

        {(status === 'streaming' || status === 'done') && (
          <div
            className={cn(
              'whitespace-pre-wrap text-sm leading-relaxed',
              status === 'streaming' && !answer && 'text-muted-foreground',
            )}
          >
            {answer || 'Waiting for response…'}
            {status === 'streaming' && (
              <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-foreground align-text-bottom" />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
