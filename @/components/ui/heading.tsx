import { cva, VariantProps } from 'class-variance-authority';
import React, { forwardRef, HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

interface HeadingProps
  extends HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {}

const headingVariants = cva("font-bold leading-tight tracking-tight", {
  variants: {
    size: {
      default: "text-3xl sm:text-4xl",
      sm: "text-2xl sm:text-3xl",
      xs: "text-lg sm:text-2xl",
      xxs: "text-base sm:text-lg",
      lg: "text-4xl sm:text-5xl",
    },
  },
  defaultVariants: { size: "default" },
});

const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, size, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        {...props}
        className={cn(headingVariants({ size, className }))}
      >
        {children}
      </p>
    );
  }
);

Heading.displayName = "Heading";

export default Heading;
