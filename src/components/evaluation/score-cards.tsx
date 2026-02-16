import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EvaluationScores, EvaluationReasoning } from '@/types/evaluation';

interface ScoreCardsProps {
  scores: EvaluationScores;
  reasoning?: EvaluationReasoning;
}

function getProgressColor(score: number): string {
  if (score >= 0.7) return '[&>[data-slot=progress-indicator]]:bg-green-500';
  if (score >= 0.4) return '[&>[data-slot=progress-indicator]]:bg-yellow-500';
  return '[&>[data-slot=progress-indicator]]:bg-red-500';
}

function getScoreLabel(score: number): string {
  if (score >= 0.7) return 'text-green-600 dark:text-green-400';
  if (score >= 0.4) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
}

interface ScoreCardItemProps {
  label: string;
  score: number;
  reasoning?: string;
}

function ScoreCardItem({ label, score, reasoning }: ScoreCardItemProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="py-4">
      <CardHeader className="pb-0 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{label}</CardTitle>
          <span className={cn('text-lg font-bold font-mono', getScoreLabel(score))}>
            {(score * 100).toFixed(0)}%
          </span>
        </div>
      </CardHeader>
      <CardContent className="px-4 pt-2 space-y-2">
        <Progress value={score * 100} className={cn('h-2', getProgressColor(score))} />
        {reasoning && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {expanded ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
            {expanded ? 'Hide' : 'Show'} reasoning
          </button>
        )}
        {expanded && reasoning && (
          <p className="text-xs text-muted-foreground leading-relaxed">{reasoning}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function ScoreCards({ scores, reasoning }: ScoreCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <ScoreCardItem
        label="Faithfulness"
        score={scores.faithfulness}
        reasoning={reasoning?.faithfulness}
      />
      <ScoreCardItem
        label="Relevance"
        score={scores.relevance}
        reasoning={reasoning?.relevance}
      />
      <ScoreCardItem
        label="Completeness"
        score={scores.completeness}
        reasoning={reasoning?.completeness}
      />
      <ScoreCardItem
        label="Overall"
        score={scores.overallScore}
      />
    </div>
  );
}
