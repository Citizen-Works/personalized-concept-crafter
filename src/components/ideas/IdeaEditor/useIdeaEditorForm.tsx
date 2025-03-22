
import { useState, useEffect } from 'react';
import { ContentIdea } from '@/types';
import { useIdeas } from '@/hooks/ideas';
import { toast } from 'sonner';

export const useIdeaEditorForm = (idea: ContentIdea, onClose: () => void) => {
  const [title, setTitle] = useState(idea.title);
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [callToAction, setCallToAction] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateIdeaAsync } = useIdeas();

  // Parse existing call to action from the idea
  useEffect(() => {
    // Set description directly
    setDescription(idea.description || "");
    
    // Extract notes and call to action
    const notesText = idea.notes || "";
    
    // Extract call to action from notes if it exists
    const ctaMatch = notesText.match(/Call to Action: (.*?)(?:\n|$)/);
    
    if (ctaMatch && ctaMatch[1]) {
      setCallToAction(ctaMatch[1].trim());
    }
    
    // Set notes without the CTA line
    let cleanedNotes = notesText
      .replace(/Call to Action: .*?(?:\n|$)/, "")
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
      // Format notes to include CTA if provided
      let formattedNotes = notes || "";
      
      // Add CTA if provided
      if (callToAction) {
        formattedNotes = `${formattedNotes}\n\nCall to Action: ${callToAction}`;
      }
      
      // Use the async version to ensure the promise resolves before proceeding
      await updateIdeaAsync({
        id: idea.id,
        title,
        description,
        notes: formattedNotes
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
    callToAction,
    setCallToAction,
    isSubmitting,
    handleSubmit
  };
};
