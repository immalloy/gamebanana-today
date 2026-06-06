import { Heart, Eye, Download } from 'lucide-react';

const icons = {
  downloads: Download,
  views: Eye,
  likes: Heart,
};

interface StatPillProps {
  type: keyof typeof icons;
  value: number;
  label: string;
}

export function StatPill({ type, value, label }: StatPillProps): JSX.Element {
  const Icon = icons[type];
  const formattedValue = value.toLocaleString();
  return (
    <span className="stat-pill" title={label} aria-label={`${formattedValue} ${label.toLowerCase()}`}>
      <Icon size={14} aria-hidden="true" />
      {formattedValue}
    </span>
  );
}
