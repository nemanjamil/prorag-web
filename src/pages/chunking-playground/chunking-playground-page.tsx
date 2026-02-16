import { useState } from 'react';
import { Scissors } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { DocumentSelector } from '@/components/chunking-lab/document-selector';
import { ComparisonPanel } from '@/components/chunking-lab/comparison-panel';

export function ChunkingPlaygroundPage() {
  const [documentId, setDocumentId] = useState<number | null>(null);
  const [comparisonMode, setComparisonMode] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <Scissors className="size-6" />
          Chunking Lab
        </h1>
        <p className="text-muted-foreground">
          Preview how different chunking strategies split a document's text.
          Compare configurations side-by-side without re-embedding.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="w-full max-w-sm">
          <DocumentSelector value={documentId} onChange={setDocumentId} />
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="comparison-mode"
            checked={comparisonMode}
            onCheckedChange={setComparisonMode}
          />
          <Label htmlFor="comparison-mode">Comparison Mode</Label>
        </div>
      </div>

      {comparisonMode ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ComparisonPanel documentId={documentId} label="Configuration A" />
          <ComparisonPanel documentId={documentId} label="Configuration B" />
        </div>
      ) : (
        <ComparisonPanel documentId={documentId} />
      )}
    </div>
  );
}
