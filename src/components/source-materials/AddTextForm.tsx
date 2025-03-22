
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { DocumentType, DocumentPurpose, DocumentContentType } from '@/types';

interface AddTextFormProps {
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  isSubmitting: boolean;
  error: string | null;
  type: DocumentType;
  setType: (type: DocumentType) => void;
  purpose: DocumentPurpose;
  handlePurposeChange: (value: string) => void;
  showContentTypeField: boolean;
  contentType: DocumentContentType;
  handleContentTypeChange: (value: string) => void;
  handleAddText: () => void;
  handleClose: () => void;
}

const AddTextForm: React.FC<AddTextFormProps> = ({
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
}) => {
  return (
    <div className="space-y-4 py-4">
      {error && (
        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
          {error}
        </div>
      )}
      <div>
        <Label htmlFor="title">Title</Label>
        <Input 
          id="title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Text title" 
        />
      </div>
      
      <div>
        <Label htmlFor="document_type">Document Type</Label>
        <Select value={type} onValueChange={(value) => setType(value as DocumentType)}>
          <SelectTrigger id="document_type">
            <SelectValue placeholder="Select document type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="blog">Blog</SelectItem>
            <SelectItem value="newsletter">Newsletter</SelectItem>
            <SelectItem value="whitepaper">Whitepaper</SelectItem>
            <SelectItem value="case-study">Case Study</SelectItem>
            <SelectItem value="transcript">Transcript</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="purpose">Document Purpose</Label>
        <Select value={purpose} onValueChange={handlePurposeChange}>
          <SelectTrigger id="purpose">
            <SelectValue placeholder="Select document purpose" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="business_context">Business Context</SelectItem>
            <SelectItem value="writing_sample">Writing Sample</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {showContentTypeField && (
        <div>
          <Label htmlFor="content_type">Content Application</Label>
          <Select 
            value={contentType || ""} 
            onValueChange={handleContentTypeChange}
          >
            <SelectTrigger id="content_type">
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
        <Label htmlFor="content">Content</Label>
        <Textarea 
          id="content" 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          placeholder="Paste or type text here" 
          className="min-h-[200px]" 
        />
      </div>
      
      <DialogFooter>
        <Button 
          variant="outline" 
          onClick={handleClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleAddText}
          disabled={isSubmitting || !content.trim() || !title.trim()}
        >
          {isSubmitting ? "Adding..." : "Add Text"}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default AddTextForm;
