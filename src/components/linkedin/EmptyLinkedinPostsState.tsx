
import React from 'react';
import { LinkedinIcon } from 'lucide-react';

const EmptyLinkedinPostsState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/10">
      <LinkedinIcon className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">No LinkedIn Posts Added</h3>
      <p className="text-sm text-muted-foreground mt-2 mb-6 max-w-md">
        Add your LinkedIn posts to help the AI understand your writing style and generate better content.
      </p>
    </div>
  );
};

export default EmptyLinkedinPostsState;
