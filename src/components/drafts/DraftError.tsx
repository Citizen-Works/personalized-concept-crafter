
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";

export const DraftError: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild className="gap-1">
          <Link to="/drafts">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Drafts</span>
          </Link>
        </Button>
      </div>
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-2">Draft Not Found</h2>
        <p className="text-muted-foreground mb-4">The draft you're looking for doesn't exist or you don't have permission to view it.</p>
        <Button asChild>
          <Link to="/drafts">Return to Drafts</Link>
        </Button>
      </div>
    </div>
  );
};
