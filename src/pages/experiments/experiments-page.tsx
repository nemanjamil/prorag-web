import { ComingSoonBanner } from '@/components/layout/coming-soon-banner';
import { PLACEHOLDER_FEATURES } from '@/lib/constants';

export function ExperimentsPage() {
  return (
    <ComingSoonBanner
      phase={7}
      title="Experiments"
      description="Run controlled experiments to compare RAG configurations."
      features={PLACEHOLDER_FEATURES['/experiments']}
    />
  );
}
