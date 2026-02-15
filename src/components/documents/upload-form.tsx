import { useState, useCallback, useRef } from 'react';
import { Upload, FileUp, Info } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useUploadDocument } from '@/hooks/use-upload-document';
import { ChunkStrategy } from '@/types/enums';
import { CHUNK_STRATEGY_DESCRIPTIONS, DEFAULTS } from '@/lib/constants';
import { formatFileSize } from '@/lib/format';
import { cn } from '@/lib/utils';

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [strategy, setStrategy] = useState<ChunkStrategy>(ChunkStrategy.RECURSIVE);
  const [chunkSize, setChunkSize] = useState(DEFAULTS.chunkSize);
  const [chunkOverlap, setChunkOverlap] = useState(DEFAULTS.chunkOverlap);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useUploadDocument();

  const isSemantic = strategy === ChunkStrategy.SEMANTIC;

  const handleFile = useCallback((f: File) => {
    if (f.type !== 'application/pdf') {
      toast.error('Only PDF files are supported');
      return;
    }
    if (f.size > DEFAULTS.maxFileSize) {
      toast.error(`File too large. Maximum size is ${formatFileSize(DEFAULTS.maxFileSize)}`);
      return;
    }
    setFile(f);
  }, []);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  function handleUpload() {
    if (!file) return;
    uploadMutation.mutate(
      {
        file,
        chunkStrategy: strategy,
        chunkSize,
        chunkOverlap: isSemantic ? 0 : chunkOverlap,
      },
      {
        onSuccess: () => {
          toast.success(`"${file.name}" uploaded and chunked successfully`);
          setFile(null);
          if (fileInputRef.current) fileInputRef.current.value = '';
        },
        onError: (error) => {
          toast.error(`Upload failed: ${error.message}`);
        },
      },
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Upload Document</CardTitle>
        <CardDescription>
          Upload a PDF file and choose how it should be split into chunks.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File picker */}
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
            isDragOver
              ? 'border-primary bg-primary/5'
              : file
                ? 'border-green-300 bg-green-50'
                : 'border-muted-foreground/25 hover:border-muted-foreground/50',
          )}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
          {file ? (
            <div className="flex items-center justify-center gap-2">
              <FileUp className="size-5 text-green-600" />
              <span className="font-medium">{file.name}</span>
              <span className="text-sm text-muted-foreground">
                ({formatFileSize(file.size)})
              </span>
            </div>
          ) : (
            <div className="space-y-1">
              <Upload className="mx-auto size-8 text-muted-foreground" />
              <p className="text-sm font-medium">Drop a PDF here or click to browse</p>
              <p className="text-xs text-muted-foreground">PDF files up to 50MB</p>
            </div>
          )}
        </div>

        {/* Chunking controls */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Chunking Strategy</Label>
            <Select value={strategy} onValueChange={(v) => setStrategy(v as ChunkStrategy)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ChunkStrategy.FIXED}>Fixed</SelectItem>
                <SelectItem value={ChunkStrategy.RECURSIVE}>Recursive</SelectItem>
                <SelectItem value={ChunkStrategy.SEMANTIC}>Semantic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Chunk Size: {chunkSize}</Label>
            <Slider
              value={[chunkSize]}
              onValueChange={([v]) => setChunkSize(v)}
              min={100}
              max={4000}
              step={50}
            />
            <p className="text-xs text-muted-foreground">100 – 4,000 characters</p>
          </div>

          <div className="space-y-2">
            <Label className={isSemantic ? 'text-muted-foreground' : ''}>
              Chunk Overlap: {isSemantic ? '—' : chunkOverlap}
            </Label>
            <Slider
              value={[chunkOverlap]}
              onValueChange={([v]) => setChunkOverlap(v)}
              min={0}
              max={500}
              step={10}
              disabled={isSemantic}
            />
            <p className="text-xs text-muted-foreground">
              {isSemantic ? 'Not applicable for semantic chunking' : '0 – 500 characters'}
            </p>
          </div>
        </div>

        {/* Strategy description */}
        <div className="flex items-start gap-2 rounded-md bg-muted/50 p-3">
          <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            <span className="font-medium capitalize">{strategy}:</span>{' '}
            {CHUNK_STRATEGY_DESCRIPTIONS[strategy]}
          </p>
        </div>

        <Button
          onClick={handleUpload}
          disabled={!file || uploadMutation.isPending}
          className="w-full sm:w-auto"
        >
          {uploadMutation.isPending ? (
            <>
              <span className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Uploading…
            </>
          ) : (
            <>
              <Upload className="mr-2 size-4" />
              Upload & Process
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
