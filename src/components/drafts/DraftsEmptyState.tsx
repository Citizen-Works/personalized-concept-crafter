
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { FileText } from 'lucide-react';

type DraftsEmptyStateProps = {
  hasFilters: boolean;
};

export const DraftsEmptyState: React.FC<DraftsEmptyStateProps> = ({ hasFilters }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/10">
      <FileText className="h-10 w-10 text-muted-foreground mb-3" />
      <h3 className="text-lg font-medium">No content drafts found</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-4">
        {hasFilters
          ? "Try adjusting your filters or search terms"
          : "Generate drafts from your content ideas to get started"}
      </p>
      <Button asChild>
        <Link to="/ideas">
          Go to Content Ideas
        </Link>
      </Button>
    </div>
  );
};
