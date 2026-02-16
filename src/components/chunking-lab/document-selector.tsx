import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useDocuments } from '@/hooks/use-documents';
import { DocumentStatus } from '@/types/enums';

interface DocumentSelectorProps {
  value: number | null;
  onChange: (id: number) => void;
}

export function DocumentSelector({ value, onChange }: DocumentSelectorProps) {
  const { data: documents, isLoading } = useDocuments();

  const readyDocs = documents?.filter((d) => d.status === DocumentStatus.READY) ?? [];

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>Document</Label>
        <Skeleton className="h-9 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>Document</Label>
      <Select
        value={value?.toString() ?? ''}
        onValueChange={(v) => onChange(Number(v))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a document…" />
        </SelectTrigger>
        <SelectContent>
          {readyDocs.map((doc) => (
            <SelectItem key={doc.id} value={doc.id.toString()}>
              {doc.originalFilename}
            </SelectItem>
          ))}
          {readyDocs.length === 0 && (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              No ready documents available
            </div>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
