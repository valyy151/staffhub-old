import { Loader } from "lucide-react";
import { cn } from "~/utils/tailwindMerge";
import { forwardRef, HTMLAttributes } from "react";
import { cva, VariantProps } from "class-variance-authority";

interface SpinnerProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {}

const spinnerVariants = cva("dark:text-slate-200 flex flex-col items-center", {
  variants: {},
  defaultVariants: { size: "default" },
});

const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} {...props} className={cn(spinnerVariants({ className }))}>
        <Loader size={48} strokeWidth={1} className="mt-24 animate-spin" />
      </div>
    );
  }
);

Spinner.displayName = "Spinner";

export default Spinner;
