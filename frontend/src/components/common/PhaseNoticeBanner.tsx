import { Info } from 'lucide-react';

interface PhaseNoticeBannerProps {
  title: string;
  description: string;
}

export function PhaseNoticeBanner({ title, description }: PhaseNoticeBannerProps) {
  return (
    <div
      role="status"
      className="flex items-start gap-3 rounded-lg border border-border bg-surface px-4 py-3 text-sm"
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
      <div className="min-w-0">
        <p className="font-medium text-foreground">{title}</p>
        <p className="mt-0.5 text-xs text-muted">{description}</p>
      </div>
    </div>
  );
}
