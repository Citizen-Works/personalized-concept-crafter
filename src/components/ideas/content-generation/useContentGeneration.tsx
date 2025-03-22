
import { useState, useEffect } from 'react';
import { ContentIdea, ContentType } from '@/types';
import { useClaudeAI } from '@/hooks/useClaudeAI';
import { useIdeas } from '@/hooks/ideas';

export const useContentGeneration = (idea: ContentIdea) => {
  const [selectedContentType, setSelectedContentType] = useState<ContentType>('linkedin');
  const [generatedContent, setGeneratedContent] = useState('');
  const { generateContent, isGenerating, error } = useClaudeAI();
  const { updateIdea } = useIdeas();
  const [progress, setProgress] = useState(0);
  
  // Extract call to action from the idea notes
  const extractCallToAction = () => {
    if (!idea.notes) return null;
    
    const ctaMatch = idea.notes.match(/Call to Action: (.*?)(?:\n|$)/);
    if (ctaMatch && ctaMatch[1]) {
      return ctaMatch[1].trim();
    }
    return null;
  };
  
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
  
  const handleGenerateContent = async () => {
    try {
      // Create temporary object with contentType for generation
      const ideaWithType = {
        ...idea,
        contentType: selectedContentType // Temporary for generation only
      };
      
      const content = await generateContent(ideaWithType, selectedContentType);
      if (content) {
        setGeneratedContent(content);
      }
    } catch (error) {
      console.error('Error generating content:', error);
    }
  };
  
  const handleClearContent = () => {
    setGeneratedContent('');
  };
  
  const callToAction = extractCallToAction();
  
  return {
    selectedContentType,
    setSelectedContentType,
    generatedContent,
    setGeneratedContent,
    isGenerating,
    error,
    progress,
    callToAction,
    handleGenerateContent,
    handleClearContent
  };
};
