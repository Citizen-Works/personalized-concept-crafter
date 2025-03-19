
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ContentGoal } from './useIdeaEditorForm';

interface IdeaEditorFormProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  notes: string;
  setNotes: (value: string) => void;
  contentGoal: ContentGoal;
  setContentGoal: (value: ContentGoal) => void;
  callToAction: string;
  setCallToAction: (value: string) => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

const IdeaEditorForm: React.FC<IdeaEditorFormProps> = ({
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
  isSubmitting,
  onSubmit,
  onClose
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6 py-4">
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
  );
};

export default IdeaEditorForm;
