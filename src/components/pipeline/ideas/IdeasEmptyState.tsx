
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

interface IdeasEmptyStateProps {
  searchActive: boolean;
}

export const IdeasEmptyState: React.FC<IdeasEmptyStateProps> = ({ searchActive }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-muted/10">
      <h3 className="text-xl font-medium mb-2">No content ideas found</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        {searchActive 
          ? "Try adjusting your filters or search query" 
          : "Content ideas that have been approved or manually created will appear here."}
      </p>
      <Button asChild>
        <Link to="/ideas/new">
          <Plus className="h-4 w-4 mr-1" />
          Create New Idea
        </Link>
      </Button>
    </div>
  );
};
