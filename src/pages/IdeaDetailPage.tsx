
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIdeasAdapter } from '@/hooks/api/adapters/useIdeasAdapter';
import { useDrafts } from '@/hooks/useDrafts';
import { toast } from 'sonner';
import { ContentType, DraftStatus } from '@/types';

// Import components
import IdeaPageHeader from '@/components/ideas/IdeaPageHeader';
import IdeaDescription from '@/components/ideas/IdeaDescription';
import IdeaNotes from '@/components/ideas/IdeaNotes';
import IdeaContentGeneration from '@/components/ideas/content-generation';
import IdeaActions from '@/components/ideas/IdeaActions';
import IdeaDetailLoading from '@/components/ideas/IdeaDetailLoading';
import IdeaDetailError from '@/components/ideas/IdeaDetailError';
import { IdeaDraftsList } from '@/components/ideas/IdeaDraftsList';
import IdeaEditor from '@/components/ideas/IdeaEditor';
import Loading from '@/components/ui/loading';

const IdeaDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const ideasAdapter = useIdeasAdapter();
  const { createDraft } = useDrafts();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  // Use the getIdea hook directly within the component body
  const { data: idea, isLoading, isError } = ideasAdapter.getIdea(id || '');
  
  const handleDeleteIdea = async () => {
    if (!idea) return;
    
    if (window.confirm('Are you sure you want to delete this idea?')) {
      try {
        await ideasAdapter.deleteIdea(idea.id);
        navigate('/ideas');
      } catch (error) {
        console.error('Error deleting idea:', error);
      }
    }
  };

  const handleApproveIdea = async () => {
    if (!idea) return;
    
    try {
      await ideasAdapter.updateIdea({
        id: idea.id,
        status: 'approved'
      });
      toast.success('Idea approved successfully');
    } catch (error) {
      console.error('Error approving idea:', error);
      toast.error('Failed to approve idea');
    }
  };

  const handleGenerateDraft = async (contentType: ContentType, content: string) => {
    if (!idea) return;
    
    if (!content) {
      toast.error('No content was generated');
      return;
    }
    
    try {
      console.log("Creating draft with content type:", contentType);
      
      // Create the draft with the generated content
      await createDraft({
        contentIdeaId: idea.id,
        content: content,
        contentType: contentType, // Store content type on the draft
        version: 1,
        feedback: '',
        status: 'draft' as DraftStatus
      });
      
      // Mark the idea as used
      if (!idea.hasBeenUsed) {
        await ideasAdapter.updateIdea({
          id: idea.id,
          hasBeenUsed: true
        });
      }
      
      toast.success(`${contentType.charAt(0).toUpperCase() + contentType.slice(1)} draft generated successfully`);
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft');
    }
  };
  
  if (isLoading) {
    return <IdeaDetailLoading />;
  }

  if (isError || !idea) {
    return <IdeaDetailError />;
  }
  
  return (
    <div className="space-y-8">
      <IdeaPageHeader 
        idea={idea} 
        onEdit={() => setIsEditorOpen(true)} 
        onApprove={handleApproveIdea}
      />
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <IdeaDescription id={idea.id} description={idea.description} />
          <IdeaNotes id={idea.id} notes={idea.notes} />
          <IdeaDraftsList ideaId={idea.id} ideaTitle={idea.title} />
        </div>
        
        <div className="space-y-6">
          <IdeaContentGeneration idea={idea} onGenerateDraft={handleGenerateDraft} />
          <IdeaActions 
            id={idea.id} 
            status={idea.status}
            hasBeenUsed={idea.hasBeenUsed}
            onDeleteIdea={handleDeleteIdea}
            onEdit={() => setIsEditorOpen(true)}
          />
        </div>
      </div>

      {isEditorOpen && idea && (
        <IdeaEditor 
          idea={idea}
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
        />
      )}
    </div>
  );
};

export default IdeaDetailPage;
