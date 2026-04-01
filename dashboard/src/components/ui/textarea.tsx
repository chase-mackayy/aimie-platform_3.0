import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-[#1e3a5f] bg-[#0d1117] px-3 py-2 text-sm text-[#f0f9ff] placeholder:text-[#64748b] focus:outline-none focus:border-[#0ea5e9] focus:ring-2 focus:ring-[rgba(14,165,233,0.2)] disabled:cursor-not-allowed disabled:opacity-50 resize-y transition-all duration-200',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
