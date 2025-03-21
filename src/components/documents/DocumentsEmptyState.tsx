
import React from 'react';
import { Button } from "@/components/ui/button";
import { Upload, FileText, Plus } from 'lucide-react';

interface DocumentsEmptyStateProps {
  onOpenUpload: () => void;
  onOpenAddText: () => void;
}

const DocumentsEmptyState: React.FC<DocumentsEmptyStateProps> = ({
  onOpenUpload,
  onOpenAddText
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/10">
      <div className="bg-primary/10 p-3 rounded-full mb-4">
        <FileText className="h-10 w-10 text-primary" />
      </div>
      <h3 className="text-lg font-medium">No source materials yet</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-md">
        Upload documents, transcripts, or add text directly to extract content ideas
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={onOpenUpload} className="flex items-center">
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>
        <Button variant="outline" onClick={onOpenAddText} className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Add Text
        </Button>
      </div>
    </div>
  );
};

export default DocumentsEmptyState;
