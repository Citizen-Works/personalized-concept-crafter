
import { useState, useEffect } from "react";
import { PersonalStory } from "@/types";

type StoryFormData = {
  title: string;
  content: string;
  tags: string[];
  contentPillarIds: string[];
  targetAudienceIds: string[];
  lesson: string;
  usageGuidance: string;
};

type StoryFormProps = {
  initialData?: Partial<StoryFormData>;
  open: boolean;
};

export const useStoryForm = ({ initialData, open }: StoryFormProps) => {
  const [formData, setFormData] = useState<StoryFormData>({
    title: "",
    content: "",
    tags: [],
    contentPillarIds: [],
    targetAudienceIds: [],
    lesson: "",
    usageGuidance: "",
    ...initialData
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Reset form when dialog is closed
  useEffect(() => {
    if (!open) {
      setFormData({
        title: "",
        content: "",
        tags: [],
        contentPillarIds: [],
        targetAudienceIds: [],
        lesson: "",
        usageGuidance: "",
        ...initialData
      });
      setIsSubmitting(false);
    }
  }, [open, initialData]);
  
  const handleFieldChange = (field: keyof StoryFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Form validation
  const isValid = formData.title.trim() !== "" && formData.content.trim() !== "";
  
  return {
    formData,
    isSubmitting,
    setIsSubmitting,
    handleFieldChange,
    isValid
  };
};
