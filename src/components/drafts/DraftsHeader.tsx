
import React from 'react';
import { List } from 'lucide-react';

export const DraftsHeader = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Content Drafts</h1>
        <p className="text-muted-foreground mt-1">
          Manage and organize your content drafts
        </p>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <div className="bg-primary/10 p-2 rounded-md">
          <List className="h-5 w-5 text-primary" />
        </div>
      </div>
    </div>
  );
};
