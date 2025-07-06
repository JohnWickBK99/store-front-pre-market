import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:border-opensea-blue disabled:pointer-events-none disabled:opacity-50 data-[slot=icon]:pointer-events-none data-[slot=icon]:shrink-0 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none aria-invalid:border-opensea-error",
  {
    variants: {
      variant: {
        default: 'bg-opensea-blue text-white shadow-xs hover:bg-opensea-blue/90',
        destructive:
          'bg-opensea-error text-white shadow-xs hover:bg-opensea-error/90 bg-opensea-error/60',
        outline:
          'border border-opensea-darkBorder bg-opensea-darkBorder text-white hover:bg-opensea-darkBlue hover:text-white',
        secondary: 'bg-opensea-darkBlue text-white shadow-xs hover:bg-opensea-darkBlue/90',
        ghost: 'hover:bg-opensea-darkBlue hover:text-white',
        link: 'text-opensea-blue underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-md px-8',
        icon: 'size-9',
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
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
