
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PersonalStory } from "@/types";
import { StoryForm } from "./form/StoryForm";
import { useStoryForm } from "./hooks/useStoryForm";

interface CreateStoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (story: Omit<PersonalStory, "id" | "createdAt" | "updatedAt" | "usageCount" | "lastUsedDate" | "isArchived">) => Promise<void>;
}

export const CreateStoryDialog: React.FC<CreateStoryDialogProps> = ({
  open,
  onOpenChange,
  onSave
}) => {
  const { 
    formData, 
    isSubmitting, 
    setIsSubmitting, 
    handleFieldChange, 
    isValid 
  } = useStoryForm({ open });
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      await onSave({
        title: formData.title.trim(),
        content: formData.content.trim(),
        tags: formData.tags,
        contentPillarIds: formData.contentPillarIds,
        targetAudienceIds: formData.targetAudienceIds,
        lesson: formData.lesson.trim(),
        usageGuidance: formData.usageGuidance.trim(),
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create story:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Story</DialogTitle>
            <DialogDescription>
              Add a personal anecdote or experience to use in your content
            </DialogDescription>
          </DialogHeader>
          
          <StoryForm 
            formData={formData}
            onChange={handleFieldChange}
          />
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Story"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
