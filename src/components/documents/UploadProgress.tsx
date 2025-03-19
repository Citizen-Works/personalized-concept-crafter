
import React from "react";
import { Progress } from "@/components/ui/progress";

interface UploadProgressProps {
  value: number;
  showLabel?: boolean;
}

const UploadProgress: React.FC<UploadProgressProps> = ({ 
  value, 
  showLabel = true 
}) => {
  if (value <= 0) return null;
  
  return (
    <div className="space-y-2">
      <Progress value={value} className="h-2" />
      {showLabel && (
        <p className="text-xs text-muted-foreground text-right">
          {value}% complete
        </p>
      )}
    </div>
  );
};

export default UploadProgress;
