import React from 'react';
import { ResponsiveText } from '@/components/ui/responsive-text';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export const PageHeader: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex flex-col gap-2">
        <ResponsiveText
          as="h1"
          mobileClasses="text-2xl font-bold tracking-tight"
          desktopClasses="text-3xl font-bold tracking-tight"
        >
          Content Pipeline
        </ResponsiveText>
        <p className="text-muted-foreground">
          Manage your content through its entire lifecycle
        </p>
      </div>
      <Button asChild>
        <Link to="/ideas/new" className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          New Idea
        </Link>
      </Button>
    </div>
  );
};
