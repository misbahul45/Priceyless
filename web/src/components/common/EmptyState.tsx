import { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center p-8 space-y-4', className)}>
      {icon && <div className="text-muted-foreground/50">{icon}</div>}
      <div className="space-y-1">
        <p className="text-lg font-medium text-foreground">{title}</p>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {action && (
        <Button variant={action.variant || 'primary'} onClick={action.onClick} size="sm">
          {action.label}
        </Button>
      )}
    </div>
  );
}