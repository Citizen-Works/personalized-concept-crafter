
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StoryFormField } from "./StoryFormField";
import { ContentPillarSelector } from "./ContentPillarSelector";
import { AudienceSelector } from "./AudienceSelector";
import { StoryTagInput } from "../StoryTagInput";
import { useContentPillars } from "@/hooks/useContentPillars";
import { useTargetAudiences } from "@/hooks/useTargetAudiences";

interface StoryFormData {
  title: string;
  content: string;
  tags: string[];
  contentPillarIds: string[];
  targetAudienceIds: string[];
  lesson: string;
  usageGuidance: string;
}

interface StoryFormProps {
  formData: StoryFormData;
  onChange: (field: keyof StoryFormData, value: any) => void;
}

export const StoryForm: React.FC<StoryFormProps> = ({
  formData,
  onChange,
}) => {
  const { contentPillars } = useContentPillars();
  const { targetAudiences } = useTargetAudiences();

  const handlePillarChange = (pillarId: string) => {
    const newPillarIds = formData.contentPillarIds.includes(pillarId)
      ? formData.contentPillarIds.filter(id => id !== pillarId)
      : [...formData.contentPillarIds, pillarId];
    
    onChange("contentPillarIds", newPillarIds);
  };
  
  const handleAudienceChange = (audienceId: string) => {
    const newAudienceIds = formData.targetAudienceIds.includes(audienceId)
      ? formData.targetAudienceIds.filter(id => id !== audienceId)
      : [...formData.targetAudienceIds, audienceId];
    
    onChange("targetAudienceIds", newAudienceIds);
  };

  return (
    <div className="grid gap-6 py-4">
      <StoryFormField id="title" label="Title">
        <Input
          id="title"
          placeholder="Give your story a memorable title"
          value={formData.title}
          onChange={(e) => onChange("title", e.target.value)}
          required
        />
      </StoryFormField>
      
      <StoryFormField id="content" label="Story Content">
        <Textarea
          id="content"
          placeholder="Share your story or experience..."
          className="min-h-[150px] resize-y"
          value={formData.content}
          onChange={(e) => onChange("content", e.target.value)}
          required
        />
      </StoryFormField>
      
      <StoryFormField 
        id="tags" 
        label="Tags"
        helperText="Use tags like 'Success', 'Challenge', 'Client', 'Learning', etc."
      >
        <StoryTagInput 
          tags={formData.tags} 
          setTags={(tags) => onChange("tags", tags)} 
        />
      </StoryFormField>
      
      <StoryFormField id="lesson" label="Lesson or Takeaway">
        <Textarea
          id="lesson"
          placeholder="What's the main point or lesson from this story?"
          className="min-h-[80px] resize-y"
          value={formData.lesson}
          onChange={(e) => onChange("lesson", e.target.value)}
        />
      </StoryFormField>
      
      <StoryFormField id="usageGuidance" label="Usage Guidance">
        <Textarea
          id="usageGuidance"
          placeholder="How and when should this story be used in content?"
          className="min-h-[80px] resize-y"
          value={formData.usageGuidance}
          onChange={(e) => onChange("usageGuidance", e.target.value)}
        />
      </StoryFormField>
      
      <StoryFormField id="contentPillars" label="Relevant Content Pillars">
        <ContentPillarSelector 
          contentPillars={contentPillars}
          selectedPillarIds={formData.contentPillarIds}
          onChange={handlePillarChange}
        />
      </StoryFormField>
      
      <StoryFormField id="targetAudiences" label="Target Audiences This Resonates With">
        <AudienceSelector
          targetAudiences={targetAudiences}
          selectedAudienceIds={formData.targetAudienceIds}
          onChange={handleAudienceChange}
        />
      </StoryFormField>
    </div>
  );
};
