
import React from 'react';
import { Copy, Edit } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from 'lucide-react';

type DraftContentProps = {
  content: string;
  contentType: string;
};

export const DraftContent: React.FC<DraftContentProps> = ({ content, contentType }) => {
  const handleCopyContent = () => {
    navigator.clipboard.writeText(content)
      .then(() => toast.success('Content copied to clipboard'))
      .catch(() => toast.error('Failed to copy content'));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Content</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1"
                onClick={handleCopyContent}
              >
                <Copy className="h-4 w-4" />
                Copy
              </Button>
            </div>
          </div>
          <CardDescription>Draft content for {contentType}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border bg-muted/40 p-6 whitespace-pre-wrap">
            {content}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" className="gap-1" disabled>
          <ChevronLeft className="h-4 w-4" />
          Previous Version
        </Button>
        <Button variant="outline" size="sm" className="gap-1" disabled>
          Next Version
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
