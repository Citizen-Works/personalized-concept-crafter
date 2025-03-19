
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PermissionErrorProps {
  permissionError: boolean;
  onRetry: () => void;
  isRetrying: boolean;
}

const PermissionError: React.FC<PermissionErrorProps> = ({
  permissionError,
  onRetry,
  isRetrying
}) => {
  if (!permissionError) return null;
  
  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Microphone access denied. Please allow microphone access in your browser settings and try again.
        </AlertDescription>
      </Alert>
      
      <div className="flex justify-center py-2">
        <Button 
          onClick={onRetry}
          disabled={isRetrying}
        >
          {isRetrying ? "Starting..." : "Try Again"}
        </Button>
      </div>
    </div>
  );
};

export default PermissionError;
