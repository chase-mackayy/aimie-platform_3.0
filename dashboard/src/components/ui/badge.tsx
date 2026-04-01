import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-[rgba(14,165,233,0.2)] text-[#0ea5e9] border border-[rgba(14,165,233,0.4)]',
        secondary: 'bg-[#1a1a2e] text-[#f0f9ff] border border-[#1e3a5f]',
        destructive: 'bg-[rgba(239,68,68,0.2)] text-[#ef4444] border border-[rgba(239,68,68,0.4)]',
        success: 'bg-[rgba(34,197,94,0.2)] text-[#22c55e] border border-[rgba(34,197,94,0.4)]',
        warning: 'bg-[rgba(234,179,8,0.2)] text-[#eab308] border border-[rgba(234,179,8,0.4)]',
        outline: 'border border-[#1e3a5f] text-[#64748b]',
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
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
