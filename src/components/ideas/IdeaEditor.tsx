
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ContentIdea } from '@/types';
import { useIdeas } from '@/hooks/ideas';
import { toast } from 'sonner';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface IdeaEditorProps {
  idea: ContentIdea;
  isOpen: boolean;
  onClose: () => void;
}

// Content goal types
type ContentGoal = 'audience_building' | 'lead_generation' | 'nurturing' | 'conversion' | 'retention' | 'other';

const IdeaEditor: React.FC<IdeaEditorProps> = ({ idea, isOpen, onClose }) => {
  const [title, setTitle] = useState(idea.title);
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [contentGoal, setContentGoal] = useState<ContentGoal>("audience_building");
  const [callToAction, setCallToAction] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateIdea, updateIdeaAsync } = useIdeas();

  // Parse existing content goal and description from the idea
  useEffect(() => {
    // Set description directly (no need to extract content goal)
    setDescription(idea.description || "");
    
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Content Idea</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter idea title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your content idea"
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add specific instructions like 'Keep it concise' or 'Plug my community'"
              className="min-h-[100px]"
            />
            <p className="text-sm text-muted-foreground">
              Add any specific instructions for AI content generation
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contentGoal">Content Goal</Label>
            <Select 
              value={contentGoal} 
              onValueChange={(value) => setContentGoal(value as ContentGoal)}
            >
              <SelectTrigger id="contentGoal">
                <SelectValue placeholder="Select content goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="audience_building">Audience Building</SelectItem>
                <SelectItem value="lead_generation">Lead Generation</SelectItem>
                <SelectItem value="nurturing">Nurturing</SelectItem>
                <SelectItem value="conversion">Conversion</SelectItem>
                <SelectItem value="retention">Retention</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              What's the primary purpose of this content?
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="callToAction">Call to Action</Label>
            <Input
              id="callToAction"
              value={callToAction}
              onChange={(e) => setCallToAction(e.target.value)}
              placeholder="What action should readers take?"
            />
            <p className="text-sm text-muted-foreground">
              Define what you want your audience to do after consuming this content
            </p>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default IdeaEditor;
