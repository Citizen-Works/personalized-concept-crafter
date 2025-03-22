
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface MethodToggleButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * A responsive toggle button used for method selection in various inputs.
 * Automatically adapts its size based on the screen size.
 */
const MethodToggleButton: React.FC<MethodToggleButtonProps> = ({
  isActive,
  onClick,
  children,
  className = ""
}) => {
  const isMobile = useIsMobile();
  
  return (
    <Button
      type="button"
      variant={isActive ? "default" : "outline"}
      onClick={onClick}
      className={cn(
        "flex-1",
        isMobile 
          ? "text-xs px-2 py-1.5" 
          : "text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-2.5",
        className
      )}
    >
      {children}
    </Button>
  );
};

export default MethodToggleButton;
