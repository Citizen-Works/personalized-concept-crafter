import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Document } from "@/types";
import { UploadCloud } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useDocuments } from "@/hooks/useDocuments";

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<Document["type"]>("blog");
  const [purpose, setPurpose] = useState<Document["purpose"]>("business_context");
  const [contentType, setContentType] = useState<Document["content_type"]>(null);
  const [file, setFile] = useState<File | null>(null);
  const [inputMethod, setInputMethod] = useState<"upload" | "manual">("manual");
  
  const { uploadDocument, createDocument, uploadProgress } = useDocuments();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setTitle(selectedFile.name.split(".")[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const documentData = {
      title,
      type,
      purpose,
      content_type: contentType,
      status: 'active' as const
    };

    try {
      if (inputMethod === "upload" && file) {
        uploadDocument({ 
          file, 
          documentData 
        });
      } else {
        createDocument({
          ...documentData,
          content
        });
      }
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error submitting document:", error);
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setType("blog");
    setPurpose("business_context");
    setContentType(null);
    setFile(null);
    setInputMethod("manual");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{inputMethod === "upload" ? "Upload Document" : "Create Document"}</DialogTitle>
          <DialogDescription>
            {inputMethod === "upload" 
              ? "Upload a document to extract text and store it for AI content generation." 
              : "Manually create a document to store text for AI content generation."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex space-x-4">
            <Button
              type="button"
              variant={inputMethod === "manual" ? "default" : "outline"}
              onClick={() => setInputMethod("manual")}
              className="flex-1"
            >
              Manual Input
            </Button>
            <Button
              type="button"
              variant={inputMethod === "upload" ? "default" : "outline"}
              onClick={() => setInputMethod("upload")}
              className="flex-1"
            >
              Upload File
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Document Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="purpose">Document Purpose</Label>
              <RadioGroup
                value={purpose}
                onValueChange={(value) => {
                  setPurpose(value as Document["purpose"]);
                  if (value === "business_context") {
                    setContentType(null);
                  }
                }}
                className="grid grid-cols-2 gap-4 pt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="business_context" id="business_context" />
                  <Label htmlFor="business_context" className="cursor-pointer">
                    Business Context
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="writing_sample" id="writing_sample" />
                  <Label htmlFor="writing_sample" className="cursor-pointer">
                    Writing Sample
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {purpose === "writing_sample" && (
              <div>
                <Label htmlFor="content_type">Content Application</Label>
                <Select
                  value={contentType || undefined}
                  onValueChange={(value) => 
                    setContentType(value as Document["content_type"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select where this writing style applies" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="general">General (All Content)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="document_type">Document Type</Label>
              <Select value={type} onValueChange={(value) => setType(value as Document["type"])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blog">Blog</SelectItem>
                  <SelectItem value="newsletter">Newsletter</SelectItem>
                  <SelectItem value="whitepaper">Whitepaper</SelectItem>
                  <SelectItem value="case-study">Case Study</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {inputMethod === "upload" ? (
              <div className="space-y-4">
                <Label htmlFor="file">Upload File</Label>
                <div className="border-2 border-dashed rounded-md p-8 text-center cursor-pointer hover:border-primary/50 transition-colors">
                  <Input
                    id="file"
                    type="file"
                    accept=".txt,.md,.doc,.docx,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Label htmlFor="file" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                      <UploadCloud className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm font-medium">
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
            ) : (
              <div>
                <Label htmlFor="content">Document Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  required
                  className="resize-none"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {inputMethod === "upload" ? "Upload" : "Save"} Document
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadModal;
