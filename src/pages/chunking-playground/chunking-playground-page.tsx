import { ComingSoonBanner } from '@/components/layout/coming-soon-banner';
import { PLACEHOLDER_FEATURES } from '@/lib/constants';

export function ChunkingPlaygroundPage() {
  return (
    <ComingSoonBanner
      phase={10}
      title="Chunking Lab"
      description="Experiment with different chunking strategies interactively."
      features={PLACEHOLDER_FEATURES['/chunking-playground']}
    />
  );
}
