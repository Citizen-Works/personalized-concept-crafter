
import { useState, useEffect } from 'react';
import { ContentIdea, ContentType } from '@/types';
import { useIdeas } from '@/hooks/ideas';
import { toast } from 'sonner';

// Content goal types
export type ContentGoal = 'audience_building' | 'lead_generation' | 'nurturing' | 'conversion' | 'retention' | 'other';

export const useIdeaEditorForm = (idea: ContentIdea, onClose: () => void) => {
  const [title, setTitle] = useState(idea.title);
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [contentGoal, setContentGoal] = useState<ContentGoal>("audience_building");
  const [callToAction, setCallToAction] = useState("");
  const [contentType, setContentType] = useState<ContentType>(idea.contentType);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateIdeaAsync } = useIdeas();

  // Parse existing content goal and description from the idea
  useEffect(() => {
    // Set description directly
    setDescription(idea.description || "");
    
    // Set content type
    setContentType(idea.contentType);
    
    // Extract content goal from notes if it exists
    const notesText = idea.notes || "";
    
    // Extract content goal pattern if it exists
    const goalMatch = notesText.match(/Content Goal: (.*?)(?:\n|$)/);
    if (goalMatch && goalMatch[1]) {
      const extractedGoal = goalMatch[1].trim().replace(' ', '_').toLowerCase();
      if (['audience_building', 'lead_generation', 'nurturing', 'conversion', 'retention', 'other'].includes(extractedGoal)) {
        setContentGoal(extractedGoal as ContentGoal);
      }
    }
    
    // Extract call to action from notes if it exists
    const ctaMatch = notesText.match(/Call to Action: (.*?)(?:\n|$)/);
    
    if (ctaMatch && ctaMatch[1]) {
      setCallToAction(ctaMatch[1].trim());
    }
    
    // Set notes without the CTA or content goal lines
    let cleanedNotes = notesText
      .replace(/Call to Action: .*?(?:\n|$)/, "")
      .replace(/Content Goal: .*?(?:\n|$)/, "")
      .trim();
      
    setNotes(cleanedNotes);
  }, [idea]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Title cannot be empty');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format notes to include content goal and CTA
      let formattedNotes = notes || "";
      
      // Add content goal at the beginning
      formattedNotes = `Content Goal: ${contentGoal.replace('_', ' ')}\n\n${formattedNotes}`;
      
      // Add CTA if provided
      if (callToAction) {
        formattedNotes = `${formattedNotes}\n\nCall to Action: ${callToAction}`;
      }
      
      // Use the async version to ensure the promise resolves before proceeding
      await updateIdeaAsync({
        id: idea.id,
        title,
        description,
        notes: formattedNotes,
        contentType // Include contentType in the update
      });
      
      toast.success('Idea updated successfully');
      onClose();
    } catch (error) {
      console.error('Error updating idea:', error);
      toast.error('Failed to update idea');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    notes,
    setNotes,
    contentGoal,
    setContentGoal,
    callToAction,
    setCallToAction,
    contentType,
    setContentType,
    isSubmitting,
    handleSubmit
  };
};
