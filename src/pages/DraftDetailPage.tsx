
import React from 'react';
import { useParams } from 'react-router-dom';
import { useDrafts } from '@/hooks/useDrafts';
import { DraftHeader } from '@/components/drafts/DraftHeader';
import { DraftContent } from '@/components/drafts/DraftContent';
import { DraftActions } from '@/components/drafts/DraftActions';
import { DraftFeedback } from '@/components/drafts/DraftFeedback';
import { IdeaLinkCard } from '@/components/drafts/IdeaLinkCard';
import { DraftLoading } from '@/components/drafts/DraftLoading';
import { DraftError } from '@/components/drafts/DraftError';

const DraftDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getDraft, updateDraft, deleteDraft } = useDrafts();
  const { data: draft, isLoading, isError } = getDraft(id || '');
  
  const handleSaveFeedback = async (feedback: string) => {
    if (!draft) return;
    
    await updateDraft({
      id: draft.id,
      feedback
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
            onDelete={deleteDraft}
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
