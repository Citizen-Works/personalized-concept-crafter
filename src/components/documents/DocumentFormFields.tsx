
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Document } from "@/types";

interface DocumentFormFieldsProps {
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  type: Document["type"];
  setType: (type: Document["type"]) => void;
  purpose: Document["purpose"];
  setPurpose: (purpose: Document["purpose"]) => void;
  contentType: Document["content_type"];
  setContentType: (contentType: Document["content_type"]) => void;
  inputMethod: "upload" | "manual";
}

const DocumentFormFields: React.FC<DocumentFormFieldsProps> = ({
  title,
  setTitle,
  content,
  setContent,
  type,
  setType,
  purpose,
  setPurpose,
  contentType,
  setContentType,
  inputMethod,
}) => {
  return (
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

      {inputMethod === "manual" && (
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
  );
};

export default DocumentFormFields;
