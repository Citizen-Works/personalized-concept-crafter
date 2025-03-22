
import React from 'react';
import { Button } from "@/components/ui/button";

export const EmptyPublishedState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-muted/10">
      <h3 className="text-xl font-medium mb-2">No published content</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        Content that has been published will appear here after you mark content as published.
      </p>
      <Button variant="outline" asChild>
        <a href="/pipeline?tab=ready">Go to Ready to Publish</a>
      </Button>
    </div>
  );
};
