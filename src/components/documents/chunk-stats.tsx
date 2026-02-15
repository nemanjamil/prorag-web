import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Chunk } from '@/types/document';

interface ChunkStatsProps {
  chunks: Chunk[] | undefined;
  isLoading: boolean;
}

export function ChunkStats({ chunks, isLoading }: ChunkStatsProps) {
  const stats = useMemo(() => {
    if (!chunks?.length) return null;
    const lengths = chunks.map((c) => c.text.length);
    const total = lengths.reduce((a, b) => a + b, 0);
    return {
      count: chunks.length,
      avgLength: Math.round(total / lengths.length),
      minLength: Math.min(...lengths),
      maxLength: Math.max(...lengths),
      totalChars: total,
    };
  }, [chunks]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Chunk Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Chunk Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No chunks available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Chunk Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Total chunks</dt>
            <dd className="font-medium">{stats.count}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Avg length</dt>
            <dd>{stats.avgLength.toLocaleString()} chars</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Min length</dt>
            <dd>{stats.minLength.toLocaleString()} chars</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Max length</dt>
            <dd>{stats.maxLength.toLocaleString()} chars</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Total characters</dt>
            <dd>{stats.totalChars.toLocaleString()}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
