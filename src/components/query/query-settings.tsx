import { Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useDocuments } from '@/hooks/use-documents';
import type { SearchMode, QueryStrategy } from '@/types/enums';
import type { PipelineSettings } from '@/types/query';
import {
  SEARCH_MODE_DESCRIPTIONS,
  QUERY_STRATEGY_DESCRIPTIONS,
} from '@/lib/constants';

interface QuerySettingsProps {
  settings: PipelineSettings;
  onChange: (patch: Partial<PipelineSettings>) => void;
  disabled: boolean;
}

export function QuerySettings({ settings, onChange, disabled }: QuerySettingsProps) {
  const { data: documents } = useDocuments();

  const strategyDescription =
    QUERY_STRATEGY_DESCRIPTIONS[settings.queryStrategy as keyof typeof QUERY_STRATEGY_DESCRIPTIONS];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Mode */}
        <div className="space-y-1.5">
          <Label>Search Mode</Label>
          <Select
            value={settings.searchMode}
            onValueChange={(v) => onChange({ searchMode: v as SearchMode })}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vector">Vector</SelectItem>
              <SelectItem value="bm25">BM25</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {SEARCH_MODE_DESCRIPTIONS[settings.searchMode]}
          </p>
        </div>

        {/* Query Strategy */}
        <div className="space-y-1.5">
          <Label>Query Strategy</Label>
          <Select
            value={settings.queryStrategy}
            onValueChange={(v) => onChange({ queryStrategy: v as QueryStrategy })}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="direct">Direct</SelectItem>
              <SelectItem value="hyde">HyDE</SelectItem>
              <SelectItem value="multi_query">Multi-Query</SelectItem>
              <SelectItem value="step_back">Step-Back</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {strategyDescription && (
          <div className="flex items-start gap-2 rounded-md bg-muted/50 p-2.5">
            <Info className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">{strategyDescription}</p>
          </div>
        )}

        {/* Reranker Toggle */}
        <div className="flex items-center justify-between">
          <Label htmlFor="reranker-switch">Reranker</Label>
          <Switch
            id="reranker-switch"
            checked={settings.rerankerEnabled}
            onCheckedChange={(checked) => onChange({ rerankerEnabled: checked })}
            disabled={disabled}
          />
        </div>

        {/* Temperature */}
        <div className="space-y-1.5">
          <Label>Temperature: {settings.temperature.toFixed(1)}</Label>
          <Slider
            value={[settings.temperature]}
            onValueChange={([v]) => onChange({ temperature: v })}
            min={0}
            max={2}
            step={0.1}
            disabled={disabled}
          />
          <p className="text-xs text-muted-foreground">0 = deterministic, 2 = creative</p>
        </div>

        {/* Retrieval Top K */}
        <div className="space-y-1.5">
          <Label>Retrieval Top K: {settings.retrievalTopK}</Label>
          <Slider
            value={[settings.retrievalTopK]}
            onValueChange={([v]) => onChange({ retrievalTopK: v })}
            min={1}
            max={100}
            step={1}
            disabled={disabled}
          />
          <p className="text-xs text-muted-foreground">Number of chunks to retrieve</p>
        </div>

        {/* Reranker Top N */}
        <div className="space-y-1.5">
          <Label className={!settings.rerankerEnabled ? 'text-muted-foreground' : ''}>
            Reranker Top N: {settings.rerankerEnabled ? settings.rerankerTopN : '—'}
          </Label>
          <Slider
            value={[settings.rerankerTopN]}
            onValueChange={([v]) => onChange({ rerankerTopN: v })}
            min={1}
            max={50}
            step={1}
            disabled={disabled || !settings.rerankerEnabled}
          />
          <p className="text-xs text-muted-foreground">
            {settings.rerankerEnabled
              ? 'Number of chunks after reranking'
              : 'Enable reranker to configure'}
          </p>
        </div>

        {/* Document Filter */}
        <div className="space-y-1.5">
          <Label>Document Filter</Label>
          <Select
            value={
              settings.documentIds && settings.documentIds.length === 1
                ? String(settings.documentIds[0])
                : 'all'
            }
            onValueChange={(v) =>
              onChange({ documentIds: v === 'all' ? null : [Number(v)] })
            }
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All documents</SelectItem>
              {documents?.map((doc) => (
                <SelectItem key={doc.id} value={String(doc.id)}>
                  {doc.originalFilename}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Search across all documents or filter to one
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
