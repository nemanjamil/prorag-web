import { Button } from '@/components/ui/button';
import type { ConfigVariant } from '@/types/query';

interface ExperimentPresetsProps {
  onApply: (configA: ConfigVariant, configB: ConfigVariant) => void;
}

const presets: { label: string; configA: ConfigVariant; configB: ConfigVariant }[] = [
  {
    label: 'Vector vs Hybrid',
    configA: { searchMode: 'vector' },
    configB: { searchMode: 'hybrid' },
  },
  {
    label: 'Reranker On/Off',
    configA: { rerankerEnabled: true },
    configB: { rerankerEnabled: false },
  },
  {
    label: 'Direct vs Multi-Query',
    configA: { queryStrategy: 'direct' },
    configB: { queryStrategy: 'multi_query' },
  },
  {
    label: 'Direct vs HyDE',
    configA: { queryStrategy: 'direct' },
    configB: { queryStrategy: 'hyde' },
  },
];

export function ExperimentPresets({ onApply }: ExperimentPresetsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {presets.map((p) => (
        <Button
          key={p.label}
          variant="outline"
          size="sm"
          onClick={() => onApply(p.configA, p.configB)}
        >
          {p.label}
        </Button>
      ))}
    </div>
  );
}
