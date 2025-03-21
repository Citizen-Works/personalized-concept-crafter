
"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorClassName?: string;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, indicatorClassName, ...props }, ref) => {
  // Use internal state to control animations
  const [internalValue, setInternalValue] = React.useState(value || 0);
  
  React.useEffect(() => {
    // Add requestAnimationFrame to ensure smooth transitions
    const rafId = requestAnimationFrame(() => {
      setInternalValue(value || 0);
    });
    
    return () => cancelAnimationFrame(rafId);
  }, [value]);
  
  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 bg-primary transition-transform duration-300 ease-in-out",
          indicatorClassName
        )}
        style={{ transform: `translateX(-${100 - (internalValue)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
