
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface SourceMaterialsErrorProps {
  onRetry: () => void;
}

const SourceMaterialsError: React.FC<SourceMaterialsErrorProps> = ({ onRetry }) => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Source Materials</CardTitle>
          <CardDescription>
            There was a problem loading your source materials. Please try again.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onRetry}>Retry</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SourceMaterialsError;
