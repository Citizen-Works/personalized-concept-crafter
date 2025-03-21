
import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

interface UploadProgressProps {
  value: number;
  showLabel?: boolean;
}

const UploadProgress: React.FC<UploadProgressProps> = ({ 
  value, 
  showLabel = true 
}) => {
  // Use state to smoothly animate progress changes
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    // Only update if value has changed significantly (more than 1%)
    if (Math.abs(value - displayValue) > 1) {
      setDisplayValue(value);
    } else if (value === 100 && displayValue !== 100) {
      setDisplayValue(100);
    }
  }, [value, displayValue]);
  
  if (value <= 0) return null;
  
  return (
    <div className="space-y-2">
      <Progress 
        value={displayValue} 
        className="h-2" 
        // Add custom indicator className to ensure smooth transitions
        indicatorClassName="transition-transform duration-300 ease-in-out"
      />
      {showLabel && (
        <p className="text-xs text-muted-foreground text-right">
          {Math.round(displayValue)}% complete
        </p>
      )}
    </div>
  );
};

export default UploadProgress;
