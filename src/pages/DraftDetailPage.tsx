
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDrafts } from '@/hooks/useDrafts';
import { DraftHeader } from '@/components/drafts/DraftHeader';
import { DraftContent } from '@/components/drafts/DraftContent';
import { DraftActions } from '@/components/drafts/DraftActions';
import { IdeaLinkCard } from '@/components/drafts/IdeaLinkCard';
import { DraftLoading } from '@/components/drafts/DraftLoading';
import { DraftError } from '@/components/drafts/DraftError';
import { DraftStatusToggle } from '@/components/drafts/DraftStatusToggle';
import { toast } from 'sonner';
import { ContentIdea, ContentType, ContentSource, ContentStatus } from '@/types';
import { supabase } from '@/integrations/supabase/client';

const DraftDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getDraft, updateDraft, deleteDraft } = useDrafts();
  const { data: draft, isLoading, isError, refetch } = getDraft(id || '');
  const [idea, setIdea] = useState<ContentIdea | null>(null);
  const [isLoadingIdea, setIsLoadingIdea] = useState(false);
  const [content, setContent] = useState<string>('');
  const [draftStatus, setDraftStatus] = useState<'draft' | 'published' | 'archived'>('draft');
  
  useEffect(() => {
    if (draft) {
      setContent(draft.content);
      setDraftStatus(draft.status || 'draft');
      
      if (draft.contentIdeaId) {
        fetchIdea(draft.contentIdeaId);
      }
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
      
      const mappedIdea: ContentIdea = {
        id: data.id,
        userId: data.user_id,
        title: data.title,
        description: data.description || "",
        notes: data.notes || "",
        source: data.source as ContentSource,
        meetingTranscriptExcerpt: data.meeting_transcript_excerpt,
        sourceUrl: data.source_url,
        status: data.status as ContentStatus,
        contentType: data.content_type as ContentType,
        createdAt: new Date(data.created_at)
      };
      
      setIdea(mappedIdea);
    } catch (error) {
      console.error('Error fetching idea:', error);
    } finally {
      setIsLoadingIdea(false);
    }
  };

  const handleUpdateContent = async (updatedContent: string) => {
    if (!draft) return;
    
    try {
      await updateDraft({
        id: draft.id,
        content: updatedContent
      });
      
      setContent(updatedContent);
      
      refetch();
      
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
  
  const handleStatusChange = async (status: 'draft' | 'published' | 'archived'): Promise<void> => {
    if (!draft) return;
    
    try {
      await updateDraft({
        id: draft.id,
        status
      });
      
      setDraftStatus(status);
      refetch();
      
      toast.success(`Draft status updated to ${status}`);
    } catch (error) {
      toast.error("Failed to update draft status");
      console.error(error);
    }
  };

  if (isLoading) {
    return <DraftLoading />;
  }

  if (isError || !draft) {
    return <DraftError />;
  }
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <DraftHeader draft={draft} />
        <DraftStatusToggle 
          status={draftStatus} 
          onStatusChange={handleStatusChange} 
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <DraftContent 
            content={content} 
            contentType={draft.contentType}
            onUpdateContent={handleUpdateContent}
          />
        </div>
        
        <div className="space-y-6">
          <DraftActions 
            draftId={draft.id}
            content={content}
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
