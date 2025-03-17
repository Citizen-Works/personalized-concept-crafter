
import React from 'react';

export const DraftsHeader: React.FC = () => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold tracking-tight">Content Drafts</h1>
      <p className="text-muted-foreground">
        Review and manage your AI-generated content drafts
      </p>
    </div>
  );
};
