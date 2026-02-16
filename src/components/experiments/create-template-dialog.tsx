import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useCreatePromptTemplate } from '@/hooks/use-prompt-templates';

const DEFAULT_SYSTEM_PROMPT = `You are a helpful assistant answering questions based on PDF document context.

Context:
{{context}}

Question: {{query}}

Answer based only on the provided context. If the context does not contain enough information to answer the question, say so clearly.`;

interface CreateTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTemplateDialog({ open, onOpenChange }: CreateTemplateDialogProps) {
  const [name, setName] = useState('');
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [description, setDescription] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const createMutation = useCreatePromptTemplate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    createMutation.mutate(
      {
        name,
        systemPrompt,
        description: description || undefined,
        isDefault: isDefault || undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setName('');
          setSystemPrompt(DEFAULT_SYSTEM_PROMPT);
          setDescription('');
          setIsDefault(false);
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Prompt Template</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="template-name">Name</Label>
            <Input
              id="template-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My custom template"
              required
              maxLength={200}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="system-prompt">System Prompt</Label>
            <Textarea
              id="system-prompt"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={12}
              className="font-mono text-xs"
              required
            />
            <p className="text-xs text-muted-foreground">
              Use {'{{context}}'} and {'{{query}}'} as placeholders.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="template-description">Description</Label>
            <Textarea
              id="template-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Optional description..."
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="is-default-switch">Set as default</Label>
            <Switch
              id="is-default-switch"
              checked={isDefault}
              onCheckedChange={setIsDefault}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
