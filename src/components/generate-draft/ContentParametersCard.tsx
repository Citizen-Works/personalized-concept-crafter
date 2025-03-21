
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { ContentType } from '@/types';
import { Lightbulb, Loader2, Bug } from 'lucide-react';

interface ContentGoal {
  value: string;
  label: string;
}

interface ContentParametersCardProps {
  contentType: ContentType;
  setContentType: (type: ContentType) => void;
  contentGoal: string | null;
  setContentGoal: (goal: string | null) => void;
  callToAction: string;
  setCallToAction: (cta: string) => void;
  lengthPreference: "shorter" | "longer" | "standard";
  setLengthPreference: (length: "shorter" | "longer" | "standard") => void;
  callToActions: { id: string; text: string }[];
  handleGenerate: () => void;
  handleDebugPrompt: () => void;
  isGenerating: boolean;
  selectedIdea: boolean;
}

const contentGoals: ContentGoal[] = [
  { value: 'audience_building', label: 'Audience Building' },
  { value: 'lead_generation', label: 'Lead Generation' },
  { value: 'nurturing', label: 'Nurturing' },
  { value: 'conversion', label: 'Conversion' },
  { value: 'retention', label: 'Retention' },
  { value: 'other', label: 'Other' }
];

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
        <CardDescription>Customize the draft generation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Content Type Selection */}
        <div className="space-y-2">
          <Label>Content Type</Label>
          <Tabs defaultValue={contentType} onValueChange={(value) => setContentType(value as ContentType)}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
              <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
              <TabsTrigger value="marketing">Marketing</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="text-xs text-muted-foreground mt-1 pl-1">
            {contentType === "linkedin" && "Short, engaging post for social sharing"}
            {contentType === "newsletter" && "Longer, more detailed content for email"}
            {contentType === "marketing" && "Persuasive copy with clear CTA"}
          </div>
        </div>
        
        <Separator />
        
        {/* Optional Parameters */}
        <div className="space-y-2">
          <Label>Content Goal (Optional)</Label>
          <Select value={contentGoal || "none"} onValueChange={(value) => setContentGoal(value === "none" ? null : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a goal (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No specific goal</SelectItem>
              {contentGoals.map((goal) => (
                <SelectItem key={goal.value} value={goal.value}>{goal.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Call to Action (Optional)</Label>
          <Select value={callToAction || "none"} onValueChange={setCallToAction}>
            <SelectTrigger>
              <SelectValue placeholder="Select a CTA (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No call to action</SelectItem>
              {callToActions.map((cta) => (
                <SelectItem key={cta.id} value={cta.text}>
                  {cta.text}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Length Preference</Label>
          <RadioGroup defaultValue={lengthPreference} onValueChange={(value) => setLengthPreference(value as "shorter" | "longer" | "standard")}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="shorter" id="shorter" />
              <Label htmlFor="shorter">Shorter</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="standard" id="standard" />
              <Label htmlFor="standard">Standard</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="longer" id="longer" />
              <Label htmlFor="longer">Longer</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="flex gap-2">
          <Button 
            className="flex-1" 
            onClick={handleGenerate} 
            disabled={!selectedIdea || isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Lightbulb className="mr-2 h-4 w-4" />
                Generate Draft
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleDebugPrompt}
            disabled={!selectedIdea || isGenerating}
            title="Debug prompt"
          >
            <Bug className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentParametersCard;
