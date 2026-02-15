import { ComingSoonBanner } from '@/components/layout/coming-soon-banner';
import { PLACEHOLDER_FEATURES } from '@/lib/constants';

export function QueryPage() {
  return (
    <ComingSoonBanner
      phase={4}
      title="Query Interface"
      description="Ask questions against your uploaded documents using different RAG strategies."
      features={PLACEHOLDER_FEATURES['/query']}
    />
  );
}
