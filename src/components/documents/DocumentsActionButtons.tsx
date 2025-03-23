
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Upload } from 'lucide-react';

interface DocumentsActionButtonsProps {
  onOpenModal: () => void;
}

const DocumentsActionButtons: React.FC<DocumentsActionButtonsProps> = ({ onOpenModal }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
      <Button variant="outline" className="gap-1 w-full sm:w-auto" onClick={onOpenModal}>
        <Upload className="h-4 w-4" />
        Upload Document
      </Button>
      <Button className="gap-1 w-full sm:w-auto" onClick={onOpenModal}>
        <Plus className="h-4 w-4" />
        Create Document
      </Button>
    </div>
  );
};

export default DocumentsActionButtons;
