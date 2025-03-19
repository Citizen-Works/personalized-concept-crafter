
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

export const EmptyDraftsState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-muted/10">
      <h3 className="text-xl font-medium mb-2">No drafts found</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        Draft content that has been generated from content ideas will appear here.
      </p>
      <Button asChild>
        <Link to="/ideas">
          Go to Content Ideas
        </Link>
      </Button>
    </div>
  );
};
