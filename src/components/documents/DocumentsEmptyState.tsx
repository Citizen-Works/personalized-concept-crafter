
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Upload } from 'lucide-react';

interface DocumentsEmptyStateProps {
  onOpenUpload: () => void;
  onOpenAddText: () => void;
}

const DocumentsEmptyState: React.FC<DocumentsEmptyStateProps> = ({
  onOpenUpload,
  onOpenAddText,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg border border-dashed border-muted-foreground/20 bg-muted/50 h-72">
      <h3 className="text-xl font-semibold mb-2">No documents yet</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Upload documents or add text to start building your content library
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={onOpenUpload} className="flex items-center gap-2">
          <Upload size={16} />
          <span>Upload Document</span>
        </Button>
        <Button variant="outline" onClick={onOpenAddText} className="flex items-center gap-2">
          <FileText size={16} />
          <span>Add Text</span>
        </Button>
      </div>
    </div>
  );
};

export default DocumentsEmptyState;
