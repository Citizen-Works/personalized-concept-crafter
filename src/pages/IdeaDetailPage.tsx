
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIdeas } from '@/hooks/ideas';
import { useDrafts } from '@/hooks/useDrafts';
import { toast } from 'sonner';

// Import components
import IdeaPageHeader from '@/components/ideas/IdeaPageHeader';
import IdeaDescription from '@/components/ideas/IdeaDescription';
import IdeaNotes from '@/components/ideas/IdeaNotes';
import IdeaContentGeneration from '@/components/ideas/IdeaContentGeneration';
import IdeaFeedback from '@/components/ideas/IdeaFeedback';
import IdeaActions from '@/components/ideas/IdeaActions';
import IdeaDetailLoading from '@/components/ideas/IdeaDetailLoading';
import IdeaDetailError from '@/components/ideas/IdeaDetailError';
import { IdeaDraftsList } from '@/components/ideas/IdeaDraftsList';
import { ContentType } from '@/types';

const IdeaDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState('');
  const { getIdea, updateIdea, deleteIdea } = useIdeas();
  const { createDraft } = useDrafts();
  const { data: idea, isLoading, isError } = getIdea(id || '');
  
  const handleFeedbackSave = async () => {
    if (!idea) return;
    
    try {
      await updateIdea({
        id: idea.id,
        notes: feedback
      });
      toast.success('Feedback saved successfully');
    } catch (error) {
      console.error('Error saving feedback:', error);
      toast.error('Failed to save feedback');
    }
  };

  const handleDeleteIdea = async () => {
    if (!idea) return;
    
    if (window.confirm('Are you sure you want to delete this idea?')) {
      try {
        await deleteIdea(idea.id);
        navigate('/ideas');
      } catch (error) {
        console.error('Error deleting idea:', error);
      }
    }
  };

  const handleGenerateDraft = async (contentType: string, content: string) => {
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
        version: 1,
        feedback: ''
      });
      
      // Update the idea status to 'drafted'
      await updateIdea({
        id: idea.id,
        status: 'drafted'
      });
      
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
      <IdeaPageHeader idea={idea} />
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <IdeaDescription id={idea.id} description={idea.description} />
          <IdeaNotes id={idea.id} notes={idea.notes} />
          <IdeaDraftsList ideaId={idea.id} />
        </div>
        
        <div className="space-y-6">
          <IdeaContentGeneration idea={idea} onGenerateDraft={handleGenerateDraft} />
          <IdeaFeedback
            feedback={feedback}
            defaultNotes={idea.notes}
            onFeedbackChange={setFeedback}
            onSaveFeedback={handleFeedbackSave}
          />
          <IdeaActions 
            id={idea.id} 
            status={idea.status}
            onDeleteIdea={handleDeleteIdea} 
          />
        </div>
      </div>
    </div>
  );
};

export default IdeaDetailPage;
