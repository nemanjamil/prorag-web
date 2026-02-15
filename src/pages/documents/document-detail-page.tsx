import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useDocument, useDeleteDocument } from '@/hooks/use-documents';
import { useDocumentChunks } from '@/hooks/use-document-chunks';
import { DocumentStatusBadge } from '@/components/documents/document-status-badge';
import { ChunkStats } from '@/components/documents/chunk-stats';
import { ChunkViewer } from '@/components/documents/chunk-viewer';
import { formatFileSize, formatDate } from '@/lib/format';
import { DocumentStatus } from '@/types/enums';

export function DocumentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const documentId = Number(id);

  const { data: document, isLoading: docLoading } = useDocument(documentId);
  const { data: chunks, isLoading: chunksLoading } = useDocumentChunks(documentId);
  const deleteDocument = useDeleteDocument();

  function handleDelete() {
    deleteDocument.mutate(documentId, {
      onSuccess: () => {
        toast.success('Document deleted');
        navigate('/documents');
      },
      onError: (error) => {
        toast.error(`Failed to delete: ${error.message}`);
      },
    });
  }

  if (docLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">Document not found.</p>
        <Button variant="link" onClick={() => navigate('/documents')}>
          Back to documents
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/documents')}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{document.originalFilename}</h1>
            <p className="text-sm text-muted-foreground">
              Uploaded {formatDate(document.createdAt)}
            </p>
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="size-4 mr-1" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete document?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete "{document.originalFilename}" and all its chunks. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Document Info</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Status</dt>
                <dd><DocumentStatusBadge status={document.status} /></dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">File size</dt>
                <dd>{formatFileSize(document.fileSizeBytes)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Pages</dt>
                <dd>{document.pageCount ?? '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Strategy</dt>
                <dd className="capitalize">{document.chunkStrategy}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Chunk size</dt>
                <dd>{document.chunkSize}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Chunk overlap</dt>
                <dd>{document.chunkOverlap}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <ChunkStats chunks={chunks} isLoading={chunksLoading} />
      </div>

      {document.status === DocumentStatus.READY && (
        <ChunkViewer
          chunks={chunks ?? []}
          isLoading={chunksLoading}
          totalChunks={document.chunkCount}
        />
      )}

      {document.status === DocumentStatus.ERROR && document.errorMessage && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-base text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{document.errorMessage}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
