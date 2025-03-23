
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIdeas } from '@/hooks/ideas';
import { toast } from 'sonner';
import { DraftHeader } from '@/components/drafts/DraftHeader';
import { DraftContent } from '@/components/drafts/DraftContent';
import { DraftActions } from '@/components/drafts/DraftActions';
import { Skeleton } from "@/components/ui/skeleton";
import ErrorDisplay from '@/components/ideas/content-generation/ErrorDisplay';
import { DraftStatusToggle } from '@/components/drafts/DraftStatusToggle';
import { DraftStatus } from '@/types';
import { IdeaLinkCard } from '@/components/drafts/IdeaLinkCard';
import { useDraftsAdapter } from '@/hooks/api/adapters/useDraftsAdapter';

const DraftDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getDraft, updateDraft, deleteDraft } = useDraftsAdapter();
  
  // Fetch the draft
  const { 
    data: draft, 
    isLoading: isDraftLoading, 
    isError: isDraftError,
    error: draftError
  } = getDraft(id || '');
  
  // Fetch the associated idea if we have a contentIdeaId
  const { getIdea } = useIdeas();
  const { 
    data: idea,
    isLoading: isIdeaLoading
  } = getIdea(draft?.contentIdeaId || '');

  // Handle updating the draft content
  const handleUpdateContent = async (content: string): Promise<void> => {
    if (!draft) return;
    try {
      await updateDraft({
        id: draft.id,
        content
      });
      // We don't need to return a boolean anymore
    } catch (error) {
      console.error('Error updating draft content:', error);
      toast.error('Failed to update content');
    }
  };

  // Handle creating a new version of the draft
  const handleCreateNewVersion = async (content: string) => {
    if (!draft) return;
    try {
      await updateDraft({
        id: draft.id,
        content,
        version: (draft.version || 1) + 1
      });
      toast.success('New version created successfully');
    } catch (error) {
      console.error('Error creating new version:', error);
      toast.error('Failed to create new version');
    }
  };

  // Handle deleting the draft
  const handleDeleteDraft = async (draftId: string): Promise<void> => {
    try {
      await deleteDraft(draftId);
      navigate('/drafts');
    } catch (error) {
      console.error('Error deleting draft:', error);
      toast.error('Failed to delete draft');
    }
  };

  // Handle status change
  const handleStatusChange = async (status: DraftStatus) => {
    if (!draft) return;
    try {
      await updateDraft({
        id: draft.id,
        status
      });
      toast.success(`Draft status updated to ${status}`);
    } catch (error) {
      console.error('Error updating draft status:', error);
      toast.error('Failed to update draft status');
    }
  };

  // Show loading state
  if (isDraftLoading) {
    return (
      <div className="container mx-auto p-6 space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Skeleton className="h-[400px] w-full" />
          </div>
          <div>
            <Skeleton className="h-[300px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (isDraftError || !draft) {
    return (
      <div className="container mx-auto p-6">
        <ErrorDisplay error={draftError || new Error('Failed to load draft')} />
        <div className="mt-4">
          <button 
            onClick={() => navigate('/drafts')}
            className="text-primary hover:underline"
          >
            Return to Drafts
          </button>
        </div>
      </div>
    );
  }

  // Create a complete draft object with idea information for the header
  const draftWithIdea = {
    ...draft,
    ideaTitle: idea?.title || 'Untitled Draft'
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <DraftHeader draft={draftWithIdea} />
      
      <div className="flex justify-end my-4">
        <DraftStatusToggle 
          status={draft.status || 'draft'} 
          onStatusChange={handleStatusChange} 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="md:col-span-2">
          <DraftContent 
            content={draft.content || ''} 
            contentType={draft.contentType || 'linkedin'}
            version={draft.version || 1}
            onUpdateContent={handleUpdateContent}
          />
        </div>
        <div className="space-y-6">
          {/* Add the IdeaLinkCard component to show the source content idea */}
          {draft.contentIdeaId && (
            <IdeaLinkCard 
              contentIdeaId={draft.contentIdeaId} 
              contentType={draft.contentType}
            />
          )}
          
          <DraftActions 
            draftId={draft.id}
            content={draft.content || ''}
            contentIdeaId={draft.contentIdeaId || ''}
            contentType={draft.contentType || 'linkedin'}
            version={draft.version || 1}
            onDelete={handleDeleteDraft}
            onUpdate={handleUpdateContent}
            onCreateNewVersion={handleCreateNewVersion}
            idea={idea}
          />
        </div>
      </div>
    </div>
  );
};

export default DraftDetailPage;
