import { ComingSoonBanner } from '@/components/layout/coming-soon-banner';
import { PLACEHOLDER_FEATURES } from '@/lib/constants';

export function EvaluationPage() {
  return (
    <ComingSoonBanner
      phase={9}
      title="Evaluation"
      description="Evaluate answer quality with automated metrics."
      features={PLACEHOLDER_FEATURES['/evaluation']}
    />
  );
}
