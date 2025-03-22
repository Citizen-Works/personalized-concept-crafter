
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface GenerationProgressProps {
  progress: number;
}

const GenerationProgress: React.FC<GenerationProgressProps> = ({ progress }) => {
  return (
    <div className="space-y-4 py-4">
      <div className="flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span className="text-muted-foreground font-medium">Generating content...</span>
      </div>
      
      {progress > 0 && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">
            {progress < 100 ? 'Thinking and crafting content...' : 'Complete!'}
          </p>
        </div>
      )}
    </div>
  );
};

export default GenerationProgress;
