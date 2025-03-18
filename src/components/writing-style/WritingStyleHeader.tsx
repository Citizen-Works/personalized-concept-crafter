
import React from 'react';

export const WritingStyleHeader: React.FC = () => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold tracking-tight">Writing Style</h1>
      <p className="text-muted-foreground">
        Define your unique writing style to ensure all generated content matches your voice
      </p>
    </div>
  );
};
