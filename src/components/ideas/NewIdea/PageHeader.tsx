
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

const PageHeader: React.FC = () => {
  return (
    <>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild className="gap-1">
          <Link to="/ideas">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Ideas</span>
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Create New Idea</h1>
        <p className="text-muted-foreground">
          Add a new content idea to your collection
        </p>
      </div>
    </>
  );
};

export default PageHeader;
