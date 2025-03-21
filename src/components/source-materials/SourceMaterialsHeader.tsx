
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText, Upload } from "lucide-react";

interface SourceMaterialsHeaderProps {
  onOpenAddText: () => void;
  onOpenUpload: () => void;
}

const SourceMaterialsHeader: React.FC<SourceMaterialsHeaderProps> = ({ 
  onOpenAddText, 
  onOpenUpload 
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 className="text-2xl font-bold">Source Materials</h1>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={onOpenAddText}
        >
          <FileText className="mr-2 h-4 w-4" />
          Add Text
        </Button>
        <Button 
          onClick={onOpenUpload}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>
      </div>
    </div>
  );
};

export default SourceMaterialsHeader;
