import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ContentIdea } from '@/types';
import { useIdeas } from '@/hooks/ideas';
import { toast } from 'sonner';
import { Pencil } from 'lucide-react';

interface InlineIdeaEditorProps {
  idea: ContentIdea;
  onSave: (updatedIdea: Partial<ContentIdea>) => void;
  onCancel: () => void;
}

const InlineIdeaEditor: React.FC<InlineIdeaEditorProps> = ({
  idea,
  onSave,
  onCancel
}) => {
  const [title, setTitle] = React.useState(idea.title);
  const [description, setDescription] = React.useState(idea.description || "");
  const [notes, setNotes] = React.useState(idea.notes || "");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Title cannot be empty');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      onSave({
        title,
        description,
        notes
      });
    } catch (error) {
      console.error('Error updating idea:', error);
      toast.error('Failed to update idea');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form id="idea-edit-form" onSubmit={handleSubmit}>
      <div className="border rounded-lg p-6 space-y-6 hover:shadow-sm transition-shadow">
        <div className="space-y-6">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter idea title"
            className="text-2xl font-semibold sm:text-3xl h-auto py-2 bg-background border shadow-sm hover:shadow focus-visible:ring-1 px-3"
            required
          />

          <div className="space-y-2">
            <h2 className="text-lg font-medium flex items-center gap-2">
              Description
              <Pencil className="h-4 w-4 text-muted-foreground" />
            </h2>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your content idea"
              className="min-h-[100px] border shadow-sm hover:shadow focus-visible:ring-1 p-3 bg-background"
            />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-lg font-medium flex items-center gap-2">
              Additional Notes
              <Pencil className="h-4 w-4 text-muted-foreground" />
            </h2>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add specific instructions like 'Keep it concise' or 'Plug my community'"
              className="min-h-[100px] border shadow-sm hover:shadow focus-visible:ring-1 p-3 bg-background"
            />
            <p className="text-sm text-muted-foreground">
              Add any specific instructions for AI content generation
            </p>
          </div>
        </div>
      </div>
    </form>
  );
};

export default InlineIdeaEditor; 