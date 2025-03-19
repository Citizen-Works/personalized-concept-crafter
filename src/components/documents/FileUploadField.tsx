
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { UploadCloud } from "lucide-react";

interface FileUploadFieldProps {
  file: File | null;
  uploadProgress: number;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  file,
  uploadProgress,
  onFileChange,
}) => {
  return (
    <div className="space-y-4">
      <Label htmlFor="file">Upload File</Label>
      <div className="border-2 border-dashed rounded-md p-4 sm:p-8 text-center cursor-pointer hover:border-primary/50 transition-colors">
        <Input
          id="file"
          type="file"
          accept=".txt,.md,.doc,.docx,.pdf"
          onChange={onFileChange}
          className="hidden"
        />
        <Label htmlFor="file" className="cursor-pointer">
          <div className="flex flex-col items-center gap-2">
            <UploadCloud className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
            <span className="text-xs sm:text-sm font-medium">
              {file ? file.name : "Click to upload or drag and drop"}
            </span>
            <span className="text-xs text-muted-foreground">
              Supports: PDF, Word (DOCX), Text (TXT), Markdown (MD)
            </span>
          </div>
        </Label>
      </div>
      
      {uploadProgress > 0 && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-xs text-muted-foreground text-right">
            {uploadProgress}% complete
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUploadField;
