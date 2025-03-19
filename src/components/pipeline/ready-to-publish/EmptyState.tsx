
import React from 'react';
import { Button } from "@/components/ui/button";

export const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-muted/10">
      <h3 className="text-xl font-medium mb-2">No content ready to publish</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        Content that is ready to be published will appear here after you mark drafts as ready.
      </p>
      <Button variant="outline" asChild>
        <a href="/pipeline?tab=drafts">Go to Drafts</a>
      </Button>
    </div>
  );
};
