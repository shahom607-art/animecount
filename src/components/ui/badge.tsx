import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none',
  {
    variants: {
      variant: {
        default: 'bg-zinc-800 text-zinc-200 border border-zinc-700/50',
        completed: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
        watching: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
        plan: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
        dropped: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
        rewatching: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
