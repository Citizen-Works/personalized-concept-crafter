
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const IdeaDetailError: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild className="gap-1">
          <Link to="/ideas">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Ideas</span>
          </Link>
        </Button>
      </div>
      <p className="text-muted-foreground">
        There was an error loading this idea. It may have been deleted or you may not have permission to view it.
      </p>
    </div>
  );
};

export default IdeaDetailError;
