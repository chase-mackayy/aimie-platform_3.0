'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0ea5e9] disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-[#0ea5e9] text-[#0a0a0a] font-semibold hover:bg-[#38bdf8] electric-button',
        destructive:
          'bg-[#ef4444] text-white hover:bg-[#dc2626]',
        outline:
          'border border-[#1e3a5f] bg-transparent text-[#f0f9ff] hover:border-[#0ea5e9] hover:text-[#0ea5e9] hover:bg-[rgba(14,165,233,0.05)]',
        secondary:
          'bg-[#1a1a2e] text-[#f0f9ff] hover:bg-[#1e3a5f]',
        ghost:
          'hover:bg-[rgba(14,165,233,0.1)] hover:text-[#0ea5e9]',
        link:
          'text-[#0ea5e9] underline-offset-4 hover:underline',
        electric:
          'bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] text-[#0a0a0a] font-bold electric-button hover:shadow-[0_0_20px_rgba(14,165,233,0.5)]',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-8 text-base',
        xl: 'h-14 px-10 text-lg',
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
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

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
