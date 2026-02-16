import { Button } from '@/components/ui/button';
import { Loader2, Play } from 'lucide-react';
import { useRunEvaluation } from '@/hooks/use-evaluation';
import type { EvaluationDetail } from '@/types/evaluation';

interface RunEvaluationButtonProps {
  queryLogId: number | null;
  onComplete?: (detail: EvaluationDetail) => void;
}

export function RunEvaluationButton({ queryLogId, onComplete }: RunEvaluationButtonProps) {
  const mutation = useRunEvaluation();

  const handleClick = () => {
    if (!queryLogId) return;
    mutation.mutate(queryLogId, {
      onSuccess: (data) => {
        onComplete?.(data);
      },
    });
  };

  return (
    <Button
      onClick={handleClick}
      disabled={!queryLogId || mutation.isPending}
      size="sm"
    >
      {mutation.isPending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Evaluating...
        </>
      ) : (
        <>
          <Play className="size-4" />
          Run Evaluation
        </>
      )}
    </Button>
  );
}
