import { Loader } from "lucide-react";
import { cn } from "~/utils/tailwindMerge";
import { forwardRef, HTMLAttributes } from "react";
import { cva, VariantProps } from "class-variance-authority";

interface SpinnerProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {}

const spinnerVariants = cva(
  "text-slate-800 animate-spin dark:text-slate-200 mt-24 flex flex-col items-center overflow-y-hidden",
  {
    variants: {},
    defaultVariants: { size: "default" },
  }
);

const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} {...props} className={cn(spinnerVariants({ className }))}>
        <Loader size={48} strokeWidth={1} />
      </div>
    );
  }
);

Spinner.displayName = "Spinner";

export default Spinner;
