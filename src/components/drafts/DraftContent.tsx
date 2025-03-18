
import React, { useState } from 'react';
import { Copy, Edit, Save, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";

type DraftContentProps = {
  content: string;
  contentType: string;
  onUpdateContent?: (content: string) => Promise<void>;
};

export const DraftContent: React.FC<DraftContentProps> = ({ 
  content, 
  contentType,
  onUpdateContent 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  
  const handleCopyContent = () => {
    navigator.clipboard.writeText(content)
      .then(() => toast.success('Content copied to clipboard'))
      .catch(() => toast.error('Failed to copy content'));
  };
  
  const handleSaveContent = async () => {
    if (!onUpdateContent) return;
    
    try {
      await onUpdateContent(editedContent);
      setIsEditing(false);
      toast.success('Content updated successfully');
    } catch (error) {
      toast.error('Failed to update content');
      console.error('Error updating content:', error);
    }
  };
  
  const handleCancelEdit = () => {
    setEditedContent(content);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Content</CardTitle>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="gap-1"
                    onClick={handleSaveContent}
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1"
                    onClick={handleCancelEdit}
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1"
                    onClick={() => setIsEditing(true)}
                    disabled={!onUpdateContent}
                  >
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
                </>
              )}
            </div>
          </div>
          <CardDescription>Draft content for {contentType}</CardDescription>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Textarea 
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[300px] font-mono"
            />
          ) : (
            <div className="rounded-md border bg-muted/40 p-6 whitespace-pre-wrap">
              {content}
            </div>
          )}
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
