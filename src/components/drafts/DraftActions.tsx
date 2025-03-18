
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Share, Edit, Copy, Trash } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { RegenerateDialog } from './RegenerateDialog';
import { useClaudeAI } from '@/hooks/useClaudeAI';
import { ContentIdea, ContentType } from '@/types';

type DraftActionsProps = {
  draftId: string;
  content: string;
  contentIdeaId: string;
  contentType: ContentType;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (content: string) => Promise<void>;
  idea?: ContentIdea;
};

export const DraftActions: React.FC<DraftActionsProps> = ({ 
  draftId, 
  content, 
  contentIdeaId, 
  contentType,
  onDelete,
  onUpdate,
  idea
}) => {
  const navigate = useNavigate();
  const [showRegenerateDialog, setShowRegenerateDialog] = useState(false);
  const { generateContent, isGenerating } = useClaudeAI();

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

  const handleRegenerate = async (instructions: string) => {
    if (!idea) {
      toast.error("Cannot regenerate without idea information");
      return;
    }

    try {
      // Add the regeneration instructions to the idea
      const ideaWithInstructions = {
        ...idea,
        regenerationInstructions: instructions
      };

      const regeneratedContent = await generateContent(ideaWithInstructions, contentType);
      
      if (regeneratedContent) {
        await onUpdate(regeneratedContent);
        toast.success('Content regenerated successfully');
        setShowRegenerateDialog(false);
      }
    } catch (error) {
      console.error('Error regenerating content:', error);
      toast.error('Failed to regenerate content');
    }
  };

  return (
    <>
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
          <Button 
            variant="outline" 
            className="w-full gap-1"
            onClick={() => setShowRegenerateDialog(true)}
          >
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

      <RegenerateDialog
        isOpen={showRegenerateDialog}
        onClose={() => setShowRegenerateDialog(false)}
        onRegenerate={handleRegenerate}
        isLoading={isGenerating}
        contentType={contentType}
      />
    </>
  );
};
