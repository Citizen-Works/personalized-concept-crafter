
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  error: Error | null;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  if (!error) return null;
  
  return (
    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-start gap-2">
      <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <span>{error.message || "An unknown error occurred"}</span>
    </div>
  );
};

export default ErrorDisplay;
