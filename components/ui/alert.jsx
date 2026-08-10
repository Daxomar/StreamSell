import React from 'react';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]-x-3 gap-y-0.5 items-start [&>svg]-4 [&>svg]-y-0.5 [&>svg]-current',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground',
        destructive: 'text-destructive bg-card [&>svg]-current *-[slot=alert-description]-destructive/90',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Alert({
  className,
  variant,
  ...props
}) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

const AlertTitle = ({ className, ...props }) => (
  <h5
    data-slot="alert-title"
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
    {...props}
  />
);

const AlertDescription = ({ className, ...props }) => (
  <div
    data-slot="alert-description"
    className={cn('text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed', className)}
    {...props}
  />
);

export { Alert, AlertTitle, AlertDescription, alertVariants };
