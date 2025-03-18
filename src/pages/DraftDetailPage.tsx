
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDrafts } from '@/hooks/useDrafts';
import { DraftHeader } from '@/components/drafts/DraftHeader';
import { DraftContent } from '@/components/drafts/DraftContent';
import { DraftActions } from '@/components/drafts/DraftActions';
import { IdeaLinkCard } from '@/components/drafts/IdeaLinkCard';
import { DraftLoading } from '@/components/drafts/DraftLoading';
import { DraftError } from '@/components/drafts/DraftError';
import { toast } from 'sonner';
import { ContentIdea } from '@/types';
import { supabase } from '@/integrations/supabase/client';

const DraftDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getDraft, updateDraft, deleteDraft } = useDrafts();
  const { data: draft, isLoading, isError } = getDraft(id || '');
  const [idea, setIdea] = useState<ContentIdea | null>(null);
  const [isLoadingIdea, setIsLoadingIdea] = useState(false);
  
  useEffect(() => {
    if (draft && draft.contentIdeaId) {
      fetchIdea(draft.contentIdeaId);
    }
  }, [draft]);
  
  const fetchIdea = async (ideaId: string) => {
    setIsLoadingIdea(true);
    try {
      const { data, error } = await supabase
        .from('content_ideas')
        .select('*')
        .eq('id', ideaId)
        .single();
      
      if (error) throw error;
      setIdea(data as ContentIdea);
    } catch (error) {
      console.error('Error fetching idea:', error);
    } finally {
      setIsLoadingIdea(false);
    }
  };

  const handleUpdateContent = async (content: string) => {
    if (!draft) return;
    
    try {
      await updateDraft({
        id: draft.id,
        content
      });
      toast.success("Content updated successfully");
    } catch (error) {
      toast.error("Failed to update content");
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
            contentType={draft.contentType}
            onDelete={handleDeleteDraft}
            onUpdate={handleUpdateContent}
            idea={idea || undefined}
          />
          
          <IdeaLinkCard contentIdeaId={draft.contentIdeaId} />
        </div>
      </div>
    </div>
  );
};

export default DraftDetailPage;
