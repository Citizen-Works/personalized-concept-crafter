
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { ContentIdea } from '@/types';
import { useIdeaEditorForm } from './useIdeaEditorForm';
import IdeaEditorForm from './IdeaEditorForm';

interface IdeaEditorProps {
  idea: ContentIdea;
  isOpen: boolean;
  onClose: () => void;
}

const IdeaEditor: React.FC<IdeaEditorProps> = ({ idea, isOpen, onClose }) => {
  const {
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
  } = useIdeaEditorForm(idea, onClose);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Content Idea</DialogTitle>
        </DialogHeader>
        
        <IdeaEditorForm
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          notes={notes}
          setNotes={setNotes}
          callToAction={callToAction}
          setCallToAction={setCallToAction}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default IdeaEditor;
