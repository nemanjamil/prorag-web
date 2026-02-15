import { UploadForm } from '@/components/documents/upload-form';
import { DocumentTable } from '@/components/documents/document-table';

export function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
        <p className="text-muted-foreground">
          Upload PDFs and configure chunking strategies to build your knowledge base.
        </p>
      </div>
      <UploadForm />
      <DocumentTable />
    </div>
  );
}
