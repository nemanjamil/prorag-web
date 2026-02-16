import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useDocuments } from '@/hooks/use-documents';
import { usePromptTemplates } from '@/hooks/use-prompt-templates';
import type { ConfigVariant } from '@/types/query';
import {
  SEARCH_MODE_DESCRIPTIONS,
  QUERY_STRATEGY_DESCRIPTIONS,
} from '@/lib/constants';

interface ExperimentConfigPanelProps {
  title: string;
  config: ConfigVariant;
  onChange: (patch: Partial<ConfigVariant>) => void;
  disabled?: boolean;
}

export function ExperimentConfigPanel({
  title,
  config,
  onChange,
  disabled,
}: ExperimentConfigPanelProps) {
  const { data: documents } = useDocuments();
  const { data: templates } = usePromptTemplates();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Mode */}
        <div className="space-y-1.5">
          <Label>Search Mode</Label>
          <Select
            value={config.searchMode ?? 'hybrid'}
            onValueChange={(v) => onChange({ searchMode: v as ConfigVariant['searchMode'] })}
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
            {SEARCH_MODE_DESCRIPTIONS[(config.searchMode ?? 'hybrid') as keyof typeof SEARCH_MODE_DESCRIPTIONS]}
          </p>
        </div>

        {/* Query Strategy */}
        <div className="space-y-1.5">
          <Label>Query Strategy</Label>
          <Select
            value={config.queryStrategy ?? 'direct'}
            onValueChange={(v) => onChange({ queryStrategy: v as ConfigVariant['queryStrategy'] })}
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
          <p className="text-xs text-muted-foreground">
            {QUERY_STRATEGY_DESCRIPTIONS[(config.queryStrategy ?? 'direct') as keyof typeof QUERY_STRATEGY_DESCRIPTIONS]}
          </p>
        </div>

        {/* Reranker Toggle */}
        <div className="flex items-center justify-between">
          <Label>Reranker</Label>
          <Switch
            checked={config.rerankerEnabled ?? true}
            onCheckedChange={(checked) => onChange({ rerankerEnabled: checked })}
            disabled={disabled}
          />
        </div>

        {/* Temperature */}
        <div className="space-y-1.5">
          <Label>Temperature: {(config.temperature ?? 0.1).toFixed(1)}</Label>
          <Slider
            value={[config.temperature ?? 0.1]}
            onValueChange={([v]) => onChange({ temperature: v })}
            min={0}
            max={2}
            step={0.1}
            disabled={disabled}
          />
        </div>

        {/* Retrieval Top K */}
        <div className="space-y-1.5">
          <Label>Retrieval Top K: {config.retrievalTopK ?? 20}</Label>
          <Slider
            value={[config.retrievalTopK ?? 20]}
            onValueChange={([v]) => onChange({ retrievalTopK: v })}
            min={1}
            max={100}
            step={1}
            disabled={disabled}
          />
        </div>

        {/* Reranker Top N */}
        <div className="space-y-1.5">
          <Label className={!(config.rerankerEnabled ?? true) ? 'text-muted-foreground' : ''}>
            Reranker Top N: {(config.rerankerEnabled ?? true) ? (config.rerankerTopN ?? 5) : '—'}
          </Label>
          <Slider
            value={[config.rerankerTopN ?? 5]}
            onValueChange={([v]) => onChange({ rerankerTopN: v })}
            min={1}
            max={50}
            step={1}
            disabled={disabled || !(config.rerankerEnabled ?? true)}
          />
        </div>

        {/* Document Filter */}
        <div className="space-y-1.5">
          <Label>Document Filter</Label>
          <Select
            value={
              config.documentIds && config.documentIds.length === 1
                ? String(config.documentIds[0])
                : 'all'
            }
            onValueChange={(v) =>
              onChange({ documentIds: v === 'all' ? undefined : [Number(v)] })
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
        </div>

        {/* Prompt Template */}
        <div className="space-y-1.5">
          <Label>Prompt Template</Label>
          <Select
            value={config.promptTemplateId ? String(config.promptTemplateId) : 'default'}
            onValueChange={(v) =>
              onChange({ promptTemplateId: v === 'default' ? undefined : Number(v) })
            }
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default template</SelectItem>
              {templates?.map((t) => (
                <SelectItem key={t.id} value={String(t.id)}>
                  {t.name}{t.isDefault ? ' (default)' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
