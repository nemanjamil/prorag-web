import { Badge } from '@/components/ui/badge';
import { DocumentStatus } from '@/types/enums';
import { cn } from '@/lib/utils';

const statusConfig: Record<DocumentStatus, { label: string; className: string }> = {
  [DocumentStatus.PENDING]: {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  [DocumentStatus.PROCESSING]: {
    label: 'Processing',
    className: 'bg-blue-100 text-blue-800 border-blue-200 animate-pulse',
  },
  [DocumentStatus.READY]: {
    label: 'Ready',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  [DocumentStatus.ERROR]: {
    label: 'Error',
    className: 'bg-red-100 text-red-800 border-red-200',
  },
};

interface DocumentStatusBadgeProps {
  status: DocumentStatus;
}

export function DocumentStatusBadge({ status }: DocumentStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={cn(config.className)}>
      {config.label}
    </Badge>
  );
}
