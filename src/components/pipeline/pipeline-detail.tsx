import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { PipelineFlow } from './pipeline-flow';
import { PipelineTimings } from './pipeline-timings';
import { PipelineChunks } from './pipeline-chunks';
import { PipelineSettings } from './pipeline-settings';
import { PipelineAnswer } from './pipeline-answer';
import { truncateText } from '@/lib/format';
import type { QueryLog } from '@/types/query';

interface PipelineDetailProps {
  log: QueryLog | undefined;
  isLoading: boolean;
  onClose: () => void;
}

export function PipelineDetail({ log, isLoading, onClose }: PipelineDetailProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!log) return null;

  const chunksCount = log.retrievedChunks?.length ?? 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-3">
        <div className="space-y-1">
          <CardTitle className="text-base">
            Query #{log.id}: {truncateText(log.queryText, 80)}
          </CardTitle>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <PipelineFlow log={log} />

        <Tabs defaultValue="timings">
          <TabsList>
            <TabsTrigger value="timings">Timings</TabsTrigger>
            <TabsTrigger value="chunks">Chunks ({chunksCount})</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="answer">Answer</TabsTrigger>
          </TabsList>

          <TabsContent value="timings" className="mt-4">
            <PipelineTimings log={log} />
          </TabsContent>

          <TabsContent value="chunks" className="mt-4">
            <PipelineChunks chunks={log.retrievedChunks} />
          </TabsContent>

          <TabsContent value="settings" className="mt-4">
            <PipelineSettings log={log} />
          </TabsContent>

          <TabsContent value="answer" className="mt-4">
            <PipelineAnswer answerText={log.answerText} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
