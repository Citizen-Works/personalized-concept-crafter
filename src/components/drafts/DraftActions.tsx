
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Share, Edit, Copy, Trash } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

type DraftActionsProps = {
  draftId: string;
  content: string;
  contentIdeaId: string;
  onDelete: (id: string) => Promise<void>;
};

export const DraftActions: React.FC<DraftActionsProps> = ({ 
  draftId, 
  content, 
  contentIdeaId, 
  onDelete 
}) => {
  const navigate = useNavigate();

  const handleCopyContent = () => {
    navigator.clipboard.writeText(content)
      .then(() => toast.success('Content copied to clipboard'))
      .catch(() => toast.error('Failed to copy content'));
  };

  const handleDeleteDraft = async () => {
    if (window.confirm('Are you sure you want to delete this draft?')) {
      try {
        await onDelete(draftId);
        toast.success('Draft deleted successfully');
        navigate('/drafts');
      } catch (error) {
        console.error('Error deleting draft:', error);
      }
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Actions</CardTitle>
        <CardDescription>
          What would you like to do with this draft?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button className="w-full gap-1">
          <Share className="h-4 w-4" />
          Publish
        </Button>
        <Button variant="outline" className="w-full gap-1">
          <Edit className="h-4 w-4" />
          Regenerate
        </Button>
        <Button 
          variant="outline" 
          className="w-full gap-1"
          onClick={handleCopyContent}
        >
          <Copy className="h-4 w-4" />
          Copy to Clipboard
        </Button>
        <Button 
          variant="destructive" 
          className="w-full gap-1"
          onClick={handleDeleteDraft}
        >
          <Trash className="h-4 w-4" />
          Delete Draft
        </Button>
      </CardContent>
    </Card>
  );
};
