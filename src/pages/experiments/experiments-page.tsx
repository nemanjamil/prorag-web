import { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ExperimentConfigPanel } from '@/components/experiments/experiment-config-panel';
import { ExperimentPresets } from '@/components/experiments/experiment-presets';
import { ComparisonSummary } from '@/components/experiments/comparison-summary';
import { ComparisonResultCard } from '@/components/experiments/comparison-result-card';
import { CreateTemplateDialog } from '@/components/experiments/create-template-dialog';
import { useCompareConfigs } from '@/hooks/use-experiments';
import type { ConfigVariant, CompareResult } from '@/types/query';

export function ExperimentsPage() {
  const [queryText, setQueryText] = useState('');
  const [configA, setConfigA] = useState<ConfigVariant>({});
  const [configB, setConfigB] = useState<ConfigVariant>({});
  const [result, setResult] = useState<CompareResult | null>(null);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  const compareMutation = useCompareConfigs();

  const handlePresetApply = useCallback(
    (presetA: ConfigVariant, presetB: ConfigVariant) => {
      setConfigA(presetA);
      setConfigB(presetB);
    },
    [],
  );

  const handleCompare = useCallback(() => {
    if (!queryText.trim()) return;
    compareMutation.mutate(
      { queryText: queryText.trim(), configA, configB },
      { onSuccess: setResult },
    );
  }, [queryText, configA, configB, compareMutation]);

  const isRunning = compareMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Experiments</h1>
          <p className="text-muted-foreground">
            Compare two RAG configurations side by side with the same query.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setTemplateDialogOpen(true)}>
          <Plus className="mr-1.5 size-4" />
          New Template
        </Button>
      </div>

      {/* Presets */}
      <div className="space-y-1.5">
        <p className="text-sm font-medium">Quick Presets</p>
        <ExperimentPresets onApply={handlePresetApply} />
      </div>

      {/* Query Input */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Query</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="Enter a question to compare across both configurations..."
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            rows={3}
            disabled={isRunning}
          />
        </CardContent>
      </Card>

      {/* Config Panels */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ExperimentConfigPanel
          title="Config A"
          config={configA}
          onChange={(patch) => setConfigA((prev) => ({ ...prev, ...patch }))}
          disabled={isRunning}
        />
        <ExperimentConfigPanel
          title="Config B"
          config={configB}
          onChange={(patch) => setConfigB((prev) => ({ ...prev, ...patch }))}
          disabled={isRunning}
        />
      </div>

      {/* Compare Button */}
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={handleCompare}
          disabled={isRunning || !queryText.trim()}
        >
          {isRunning ? 'Comparing...' : 'Compare'}
        </Button>
      </div>

      {/* Error */}
      {compareMutation.isError && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">
              {compareMutation.error?.message ?? 'Comparison failed'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <ComparisonSummary comparison={result.comparison} />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <ComparisonResultCard title="Result A" log={result.resultA} />
            <ComparisonResultCard title="Result B" log={result.resultB} />
          </div>
        </div>
      )}

      {/* Template Dialog */}
      <CreateTemplateDialog
        open={templateDialogOpen}
        onOpenChange={setTemplateDialogOpen}
      />
    </div>
  );
}
