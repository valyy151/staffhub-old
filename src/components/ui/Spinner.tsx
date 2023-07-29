import { Loader } from "lucide-react";
import { cn } from "~/utils/tailwindMerge";
import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

interface SpinnerProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {}

const spinnerVariants = cva(
  "dark:text-slate-400 text-slate-600 flex flex-col items-center mt-24",
  {
    variants: {},
    defaultVariants: { size: "default" },
  }
);

const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} {...props} className={cn(spinnerVariants({ className }))}>
        <Loader size={40} strokeWidth={0.75} className="animate-spin" />
      </div>
    );
  }
);

Spinner.displayName = "Spinner";

export default Spinner;
