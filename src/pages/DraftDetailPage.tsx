
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDrafts } from '@/hooks/useDrafts';
import { DraftHeader } from '@/components/drafts/DraftHeader';
import { DraftContent } from '@/components/drafts/DraftContent';
import { DraftActions } from '@/components/drafts/DraftActions';
import { DraftFeedback } from '@/components/drafts/DraftFeedback';
import { IdeaLinkCard } from '@/components/drafts/IdeaLinkCard';
import { DraftLoading } from '@/components/drafts/DraftLoading';
import { DraftError } from '@/components/drafts/DraftError';
import { toast } from 'sonner';

const DraftDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getDraft, updateDraft, deleteDraft } = useDrafts();
  const { data: draft, isLoading, isError } = getDraft(id || '');
  
  const handleSaveFeedback = async (feedback: string) => {
    if (!draft) return;
    
    try {
      await updateDraft({
        id: draft.id,
        feedback
      });
      toast.success("Feedback saved successfully");
    } catch (error) {
      toast.error("Failed to save feedback");
      console.error(error);
    }
  };

  const handleDeleteDraft = async (id: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      try {
        deleteDraft(id);
        toast.success("Draft deleted successfully");
        navigate('/drafts');
        resolve();
      } catch (error) {
        toast.error("Failed to delete draft");
        reject(error);
      }
    });
  };

  if (isLoading) {
    return <DraftLoading />;
  }

  if (isError || !draft) {
    return <DraftError />;
  }
  
  return (
    <div className="space-y-8">
      <DraftHeader draft={draft} />
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <DraftContent 
            content={draft.content} 
            contentType={draft.contentType} 
          />
        </div>
        
        <div className="space-y-6">
          <DraftActions 
            draftId={draft.id}
            content={draft.content}
            contentIdeaId={draft.contentIdeaId}
            onDelete={handleDeleteDraft}
          />
          
          <DraftFeedback 
            initialFeedback={draft.feedback} 
            onSaveFeedback={handleSaveFeedback}
          />
          
          <IdeaLinkCard contentIdeaId={draft.contentIdeaId} />
        </div>
      </div>
    </div>
  );
};

export default DraftDetailPage;
