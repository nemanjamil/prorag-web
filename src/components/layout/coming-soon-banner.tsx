import { Construction } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ComingSoonBannerProps {
  phase: number;
  title: string;
  description: string;
  features: string[];
}

export function ComingSoonBanner({ phase, title, description, features }: ComingSoonBannerProps) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
            <Construction className="size-6 text-muted-foreground" />
          </div>
          <div className="flex justify-center mb-2">
            <Badge variant="secondary">Phase {phase}</Badge>
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <h4 className="text-sm font-medium mb-2">Planned features:</h4>
          <ul className="space-y-1.5">
            {features.map((feature) => (
              <li key={feature} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="mt-1.5 size-1.5 rounded-full bg-muted-foreground/40 shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
