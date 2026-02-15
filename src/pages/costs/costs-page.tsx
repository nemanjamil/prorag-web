import { ComingSoonBanner } from '@/components/layout/coming-soon-banner';
import { PLACEHOLDER_FEATURES } from '@/lib/constants';

export function CostsPage() {
  return (
    <ComingSoonBanner
      phase={8}
      title="Cost Tracking"
      description="Monitor token usage and costs across your RAG queries."
      features={PLACEHOLDER_FEATURES['/costs']}
    />
  );
}
