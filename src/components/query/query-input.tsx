import { useState } from 'react';
import { Send, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface QueryInputProps {
  onSubmit: (queryText: string) => void;
  onCancel: () => void;
  isStreaming: boolean;
}

export function QueryInput({ onSubmit, onCancel, isStreaming }: QueryInputProps) {
  const [text, setText] = useState('');

  function handleSubmit() {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;
    onSubmit(trimmed);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="space-y-3">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask a question about your documents..."
        className="min-h-[100px] resize-none"
        disabled={isStreaming}
      />
      <div className="flex items-center gap-2">
        {isStreaming ? (
          <Button variant="destructive" size="sm" onClick={onCancel}>
            <Square className="mr-2 size-4" />
            Cancel
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={!text.trim()} size="sm">
            <Send className="mr-2 size-4" />
            Submit
          </Button>
        )}
        <span className="text-xs text-muted-foreground">
          {isStreaming ? 'Streaming response…' : 'Ctrl+Enter to submit'}
        </span>
      </div>
    </div>
  );
}
