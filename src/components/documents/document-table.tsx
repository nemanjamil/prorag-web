import { Link } from 'react-router-dom';
import { MoreHorizontal, Trash2, Eye, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useDocuments, useDeleteDocument } from '@/hooks/use-documents';
import { DocumentStatusBadge } from './document-status-badge';
import { formatFileSize, formatDate } from '@/lib/format';
import { useState } from 'react';

export function DocumentTable() {
  const { data: documents, isLoading } = useDocuments();
  const deleteDocument = useDeleteDocument();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const docToDelete = documents?.find((d) => d.id === deleteId);

  function handleDelete() {
    if (deleteId === null) return;
    deleteDocument.mutate(deleteId, {
      onSuccess: () => {
        toast.success('Document deleted');
        setDeleteId(null);
      },
      onError: (error) => {
        toast.error(`Failed to delete: ${error.message}`);
      },
    });
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!documents?.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="size-12 text-muted-foreground/50 mb-3" />
          <h3 className="font-medium mb-1">No documents yet</h3>
          <p className="text-sm text-muted-foreground">
            Upload a PDF above to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your Documents ({documents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Filename</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Strategy</TableHead>
                <TableHead className="hidden md:table-cell">Chunks</TableHead>
                <TableHead className="hidden md:table-cell">Size</TableHead>
                <TableHead className="hidden lg:table-cell">Created</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <Link
                      to={`/documents/${doc.id}`}
                      className="font-medium hover:underline"
                    >
                      {doc.originalFilename}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <DocumentStatusBadge status={doc.status} />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell capitalize">
                    {doc.chunkStrategy}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {doc.chunkCount}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatFileSize(doc.fileSizeBytes)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {formatDate(doc.createdAt)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/documents/${doc.id}`}>
                            <Eye className="mr-2 size-4" />
                            View details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeleteId(doc.id)}
                        >
                          <Trash2 className="mr-2 size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete document?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{docToDelete?.originalFilename}" and all its chunks.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
