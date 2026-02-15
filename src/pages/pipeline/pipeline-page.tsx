import { ComingSoonBanner } from '@/components/layout/coming-soon-banner';
import { PLACEHOLDER_FEATURES } from '@/lib/constants';

export function PipelinePage() {
  return (
    <ComingSoonBanner
      phase={6}
      title="Pipeline Visualizer"
      description="See the full RAG pipeline execution in real time."
      features={PLACEHOLDER_FEATURES['/pipeline']}
    />
  );
}
