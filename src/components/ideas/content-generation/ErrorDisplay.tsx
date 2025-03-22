
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { ClaudeErrorResponse } from '@/services/claudeAIService';

interface ErrorDisplayProps {
  error: Error | ClaudeErrorResponse | null;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  if (!error) return null;
  
  // Get the error message regardless of error type
  const errorMessage = error.message || "An unknown error occurred";
  
  return (
    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-start gap-2">
      <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <span>{errorMessage}</span>
    </div>
  );
};

export default ErrorDisplay;
