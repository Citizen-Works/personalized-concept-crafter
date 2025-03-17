
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Lightbulb, Plus } from 'lucide-react';

interface EmptyIdeasStateProps {
  message: string;
  searchActive: boolean;
}

const EmptyIdeasState: React.FC<EmptyIdeasStateProps> = ({ message, searchActive }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/10">
      <Lightbulb className="h-10 w-10 text-muted-foreground mb-3" />
      <h3 className="text-lg font-medium">{message}</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-4">
        {searchActive
          ? "Try adjusting your filters or search terms"
          : "Create your first content idea to get started"}
      </p>
      <Button asChild>
        <Link to="/ideas/new" className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          New Idea
        </Link>
      </Button>
    </div>
  );
};

export default EmptyIdeasState;
