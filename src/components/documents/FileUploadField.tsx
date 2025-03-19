
import React from "react";
import { Label } from "@/components/ui/label";
import UploadDropzone from "./UploadDropzone";
import UploadProgress from "./UploadProgress";

interface FileUploadFieldProps {
  file: File | null;
  uploadProgress: number;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  acceptedFileTypes?: string;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  file,
  uploadProgress,
  onFileChange,
  acceptedFileTypes
}) => {
  return (
    <div className="space-y-4">
      <Label htmlFor="file">Upload File</Label>
      <UploadDropzone
        file={file}
        onFileChange={onFileChange}
        acceptedFileTypes={acceptedFileTypes}
      />
      
      <UploadProgress value={uploadProgress} />
    </div>
  );
};

export default FileUploadField;
