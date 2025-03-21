
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2, Bug, PenLine } from 'lucide-react';
import { ContentIdea, ContentType } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

interface ContentParametersCardProps {
  contentType: ContentType;
  setContentType: (type: ContentType) => void;
  contentGoal: string | null;
  setContentGoal: (goal: string | null) => void;
  callToAction: string;
  setCallToAction: (cta: string) => void;
  lengthPreference: "shorter" | "longer" | "standard";
  setLengthPreference: (pref: "shorter" | "longer" | "standard") => void;
  callToActions: string[];
  handleGenerate: () => void;
  handleDebugPrompt: () => void;
  isGenerating: boolean;
  selectedIdea: boolean;
}

const ContentParametersCard: React.FC<ContentParametersCardProps> = ({
  contentType,
  setContentType,
  contentGoal,
  setContentGoal,
  callToAction,
  setCallToAction,
  lengthPreference,
  setLengthPreference,
  callToActions,
  handleGenerate,
  handleDebugPrompt,
  isGenerating,
  selectedIdea
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Parameters</CardTitle>
        <CardDescription>Customize how your content is generated</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Content Type */}
        <div className="space-y-2">
          <Label htmlFor="content-type">Content Type</Label>
          <Select value={contentType} onValueChange={(value) => setContentType(value as ContentType)}>
            <SelectTrigger id="content-type">
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="linkedin">LinkedIn Post</SelectItem>
              <SelectItem value="newsletter">Newsletter</SelectItem>
              <SelectItem value="marketing">Marketing Content</SelectItem>
              <SelectItem value="blog">Blog Post</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Call to Action */}
        <div className="space-y-2">
          <Label htmlFor="call-to-action">Call to Action</Label>
          <Select 
            value={callToAction} 
            onValueChange={setCallToAction}
          >
            <SelectTrigger id="call-to-action">
              <SelectValue placeholder="Select a call to action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {callToActions.map((cta) => (
                <SelectItem key={cta} value={cta}>
                  {cta}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Length Preference */}
        <div className="space-y-2">
          <Label>Length Preference</Label>
          <RadioGroup
            value={lengthPreference}
            onValueChange={(value) => setLengthPreference(value as "shorter" | "longer" | "standard")}
            className="grid grid-cols-3 gap-2"
          >
            <Label
              htmlFor="shorter"
              className={`flex cursor-pointer items-center justify-center rounded-md border border-muted bg-transparent p-2 text-xs ${
                lengthPreference === "shorter" ? "border-primary" : ""
              }`}
            >
              <RadioGroupItem
                value="shorter"
                id="shorter"
                className="sr-only"
              />
              Shorter
            </Label>
            <Label
              htmlFor="standard"
              className={`flex cursor-pointer items-center justify-center rounded-md border border-muted bg-transparent p-2 text-xs ${
                lengthPreference === "standard" ? "border-primary" : ""
              }`}
            >
              <RadioGroupItem
                value="standard"
                id="standard"
                className="sr-only"
              />
              Standard
            </Label>
            <Label
              htmlFor="longer"
              className={`flex cursor-pointer items-center justify-center rounded-md border border-muted bg-transparent p-2 text-xs ${
                lengthPreference === "longer" ? "border-primary" : ""
              }`}
            >
              <RadioGroupItem
                value="longer"
                id="longer"
                className="sr-only"
              />
              Longer
            </Label>
          </RadioGroup>
        </div>
        
        <Separator />
        
        {/* Generate Buttons */}
        <div className="space-y-2">
          <Button 
            className="w-full" 
            onClick={handleGenerate}
            disabled={isGenerating || !selectedIdea}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <PenLine className="mr-2 h-4 w-4" />
                Generate Draft
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full" 
            onClick={handleDebugPrompt}
            disabled={isGenerating || !selectedIdea}
          >
            <Bug className="mr-2 h-4 w-4" />
            Debug Prompt
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentParametersCard;
