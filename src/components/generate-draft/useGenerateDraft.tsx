
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIdeas } from '@/hooks/ideas';
import { useClaudeAI } from '@/hooks/useClaudeAI';
import { useDrafts } from '@/hooks/useDrafts';
import { useCallToActions } from '@/hooks/useCallToActions';
import { toast } from 'sonner';
import { ContentIdea, ContentType } from '@/types';

export function useGenerateDraft() {
  const navigate = useNavigate();
  const { ideas, isLoading: isLoadingIdeas } = useIdeas();
  const { generateContent, isGenerating, debugPrompt } = useClaudeAI();
  const { createDraft } = useDrafts();
  const { callToActions, isLoading: isLoadingCTAs } = useCallToActions();
  
  // States
  const [showDebugDialog, setShowDebugDialog] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<ContentIdea | null>(null);
  const [contentType, setContentType] = useState<ContentType>("linkedin");
  const [contentGoal, setContentGoal] = useState<string | null>(null);
  const [callToAction, setCallToAction] = useState<string>("");
  const [lengthPreference, setLengthPreference] = useState<"shorter" | "longer" | "standard">("standard");
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Progress animation effect when generating content
  useEffect(() => {
    let progressInterval: ReturnType<typeof setInterval>;
    
    if (isGenerating) {
      // Reset progress when starting generation
      setProgress(0);
      
      // Create a realistic-looking progress animation
      progressInterval = setInterval(() => {
        setProgress(currentProgress => {
          // Move quickly to 70%, then slow down to simulate waiting for the API
          if (currentProgress < 70) {
            return currentProgress + 2;
          } else {
            // Slow down as we approach 90%
            return Math.min(currentProgress + 0.5, 90);
          }
        });
      }, 150);
    } else if (progress > 0) {
      // When generation completes, jump to 100%
      setProgress(100);
      
      // Reset progress after a delay
      const resetTimeout = setTimeout(() => {
        setProgress(0);
      }, 1000);
      
      return () => clearTimeout(resetTimeout);
    }
    
    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isGenerating, progress]);
  
  const handleGenerate = async () => {
    if (!selectedIdea) {
      toast.error('Please select a content idea first');
      return;
    }
    
    try {
      // Add the content goal and CTA to the idea notes if provided
      let ideaWithParams = { ...selectedIdea };
      let notes = selectedIdea.notes || "";
      
      if (contentGoal) {
        notes = `Content Goal: ${contentGoal.replace('_', ' ')}\n\n${notes}`;
      }
      
      if (callToAction) {
        notes = `${notes}\n\nCall to Action: ${callToAction}`;
      }
      
      if (lengthPreference !== "standard") {
        notes = `${notes}\n\nLength Preference: ${lengthPreference}`;
      }
      
      ideaWithParams.notes = notes;
      ideaWithParams.contentType = contentType;
      
      // Generate content
      const content = await generateContent(ideaWithParams, contentType);
      if (content) {
        setGeneratedContent(content);
      }
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate content');
    }
  };
  
  const handleDebugPrompt = async () => {
    if (!selectedIdea) {
      toast.error('Please select a content idea first');
      return;
    }
    
    try {
      // Add the content goal and CTA to the idea notes if provided
      let ideaWithParams = { ...selectedIdea };
      let notes = selectedIdea.notes || "";
      
      if (contentGoal) {
        notes = `Content Goal: ${contentGoal.replace('_', ' ')}\n\n${notes}`;
      }
      
      if (callToAction) {
        notes = `${notes}\n\nCall to Action: ${callToAction}`;
      }
      
      if (lengthPreference !== "standard") {
        notes = `${notes}\n\nLength Preference: ${lengthPreference}`;
      }
      
      ideaWithParams.notes = notes;
      ideaWithParams.contentType = contentType;
      
      // Generate content in debug mode (true as the third parameter)
      await generateContent(ideaWithParams, contentType, true);
      setShowDebugDialog(true);
    } catch (error) {
      console.error('Error debugging prompt:', error);
      toast.error('Failed to generate debug prompt');
    }
  };
  
  const handleSaveDraft = async () => {
    if (!selectedIdea || !generatedContent) {
      toast.error('No content to save');
      return;
    }
    
    try {
      // Create a draft
      await createDraft({
        contentIdeaId: selectedIdea.id,
        content: generatedContent,
        version: 1,
        feedback: '',
      });
      
      // Update the idea status to drafted
      const { updateIdea } = useIdeas();
      await updateIdea({
        id: selectedIdea.id,
        status: 'drafted',
        contentType: contentType
      });
      
      toast.success('Draft saved successfully');
      navigate(`/pipeline?tab=drafts`);
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft');
    }
  };

  return {
    ideas,
    isLoadingIdeas,
    callToActions,
    isLoadingCTAs,
    selectedIdea,
    setSelectedIdea,
    contentType,
    setContentType,
    contentGoal,
    setContentGoal,
    callToAction,
    setCallToAction,
    lengthPreference,
    setLengthPreference,
    generatedContent,
    setGeneratedContent,
    isEditing,
    setIsEditing,
    progress,
    isGenerating,
    debugPrompt,
    showDebugDialog,
    setShowDebugDialog,
    handleGenerate,
    handleDebugPrompt,
    handleSaveDraft
  };
}
