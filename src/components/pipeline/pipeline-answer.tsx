import { ScrollArea } from '@/components/ui/scroll-area';

interface PipelineAnswerProps {
  answerText: string | null;
}

export function PipelineAnswer({ answerText }: PipelineAnswerProps) {
  if (!answerText) {
    return <p className="text-sm text-muted-foreground">No answer generated</p>;
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="prose prose-sm max-w-none pr-3 dark:prose-invert">
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{answerText}</p>
      </div>
    </ScrollArea>
  );
}
