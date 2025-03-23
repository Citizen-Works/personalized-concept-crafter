
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Upload } from 'lucide-react';

interface DocumentsHeaderProps {
  onOpenCreateModal: () => void;
}

const DocumentsHeader: React.FC<DocumentsHeaderProps> = ({ onOpenCreateModal }) => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Documents</h1>
      <p className="text-sm sm:text-base text-muted-foreground">
        Manage your content documents and writing samples
      </p>
    </div>
  );
};

export default DocumentsHeader;
