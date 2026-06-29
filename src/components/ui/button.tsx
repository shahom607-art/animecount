import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-zinc-100 text-zinc-900 hover:bg-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white shadow-sm',
        secondary: 'bg-zinc-800/80 text-zinc-200 hover:bg-zinc-800 hover:text-white border border-zinc-700/50',
        outline: 'border border-zinc-800 bg-transparent hover:bg-zinc-900 hover:text-zinc-100 text-zinc-300',
        ghost: 'hover:bg-zinc-800/60 hover:text-zinc-100 text-zinc-400',
        danger: 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-xl px-3 text-xs',
        lg: 'h-12 rounded-2xl px-6 text-base font-semibold',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
