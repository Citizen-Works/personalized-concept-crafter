
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const LinkedinPostsLoading: React.FC = () => {
  return (
    <Card className="animate-pulse">
      <CardHeader className="bg-muted/20 h-12"></CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <div className="h-4 bg-muted/20 rounded"></div>
          <div className="h-4 bg-muted/20 rounded w-3/4"></div>
          <div className="h-4 bg-muted/20 rounded w-1/2"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkedinPostsLoading;
