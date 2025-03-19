
import React from "react";
import { Button } from "@/components/ui/button";

interface MethodToggleButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const MethodToggleButton: React.FC<MethodToggleButtonProps> = ({
  isActive,
  onClick,
  children,
  className = ""
}) => {
  return (
    <Button
      type="button"
      variant={isActive ? "default" : "outline"}
      onClick={onClick}
      className={`flex-1 ${className}`}
    >
      {children}
    </Button>
  );
};

export default MethodToggleButton;
