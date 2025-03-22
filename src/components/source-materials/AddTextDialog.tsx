
import React from 'react';
import {
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription
} from "@/components/ui/dialog";
import AddTextForm from './AddTextForm';
import { useAddTextForm } from '@/hooks/documents/useAddTextForm';

interface AddTextDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddTextDialog: React.FC<AddTextDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const {
    title,
    setTitle,
    content,
    setContent,
    isSubmitting,
    error,
    type,
    setType,
    purpose,
    handlePurposeChange,
    showContentTypeField,
    contentType,
    handleContentTypeChange,
    handleAddText,
    handleClose
  } = useAddTextForm(onSuccess, () => onOpenChange(false));

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Text</DialogTitle>
          <DialogDescription>
            Paste or type text content to add as a document
          </DialogDescription>
        </DialogHeader>
        
        <AddTextForm
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          isSubmitting={isSubmitting}
          error={error}
          type={type}
          setType={setType}
          purpose={purpose}
          handlePurposeChange={handlePurposeChange}
          showContentTypeField={showContentTypeField}
          contentType={contentType}
          handleContentTypeChange={handleContentTypeChange}
          handleAddText={handleAddText}
          handleClose={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddTextDialog;
