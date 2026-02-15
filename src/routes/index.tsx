import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/layouts/app-layout';
import { DocumentsPage } from '@/pages/documents/documents-page';
import { DocumentDetailPage } from '@/pages/documents/document-detail-page';
import { QueryPage } from '@/pages/query/query-page';
import { PipelinePage } from '@/pages/pipeline/pipeline-page';
import { ExperimentsPage } from '@/pages/experiments/experiments-page';
import { CostsPage } from '@/pages/costs/costs-page';
import { EvaluationPage } from '@/pages/evaluation/evaluation-page';
import { ChunkingPlaygroundPage } from '@/pages/chunking-playground/chunking-playground-page';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/documents" replace /> },
      { path: 'documents', element: <DocumentsPage /> },
      { path: 'documents/:id', element: <DocumentDetailPage /> },
      { path: 'query', element: <QueryPage /> },
      { path: 'pipeline', element: <PipelinePage /> },
      { path: 'experiments', element: <ExperimentsPage /> },
      { path: 'costs', element: <CostsPage /> },
      { path: 'evaluation', element: <EvaluationPage /> },
      { path: 'chunking-playground', element: <ChunkingPlaygroundPage /> },
    ],
  },
]);
