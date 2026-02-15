import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ChunkCard } from './chunk-card';
import type { Chunk } from '@/types/document';

interface ChunkViewerProps {
  chunks: Chunk[];
  isLoading: boolean;
  totalChunks: number;
}

export function ChunkViewer({ chunks, isLoading, totalChunks }: ChunkViewerProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedChunk = chunks[selectedIndex];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Chunk Browser</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!chunks.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Chunk Browser</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No chunks to display.</p>
        </CardContent>
      </Card>
    );
  }

  const wordCount = selectedChunk ? selectedChunk.text.split(/\s+/).filter(Boolean).length : 0;
  const positionPercent = totalChunks > 1 ? (selectedIndex / (totalChunks - 1)) * 100 : 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Chunk Browser
          <Badge variant="secondary" className="ml-2 font-normal">
            {totalChunks} chunks
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr]">
          {/* Left: chunk list */}
          <ScrollArea className="h-[500px] rounded-md border p-2">
            <div className="space-y-2">
              {chunks.map((chunk, index) => (
                <ChunkCard
                  key={chunk.chunkIndex}
                  chunk={chunk}
                  isSelected={index === selectedIndex}
                  onClick={() => setSelectedIndex(index)}
                />
              ))}
            </div>
          </ScrollArea>

          {/* Right: chunk detail */}
          {selectedChunk && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">
                  Chunk {selectedChunk.chunkIndex}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {selectedIndex + 1} of {totalChunks}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Position in document</span>
                  <span>{Math.round(positionPercent)}%</span>
                </div>
                <Progress value={positionPercent} className="h-2" />
              </div>

              <Tabs defaultValue="content">
                <TabsList>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="metadata">Metadata</TabsTrigger>
                </TabsList>
                <TabsContent value="content" className="mt-3">
                  <div className="rounded-md border bg-muted/30 p-4">
                    <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                      {selectedChunk.text}
                    </pre>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {selectedChunk.text.length.toLocaleString()} characters
                    {' · '}
                    {wordCount.toLocaleString()} words
                  </p>
                </TabsContent>
                <TabsContent value="metadata" className="mt-3">
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Chunk index</dt>
                      <dd>{selectedChunk.chunkIndex}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Page number</dt>
                      <dd>{selectedChunk.pageNumber ?? '—'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Start character</dt>
                      <dd>{selectedChunk.startChar.toLocaleString()}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">End character</dt>
                      <dd>{selectedChunk.endChar.toLocaleString()}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Character count</dt>
                      <dd>{selectedChunk.text.length.toLocaleString()}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Word count</dt>
                      <dd>{wordCount.toLocaleString()}</dd>
                    </div>
                  </dl>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
