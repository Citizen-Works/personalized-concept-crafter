
import { useState } from 'react';
import { toast } from 'sonner';
import { WritingStyleProfile, TestWritingStyleProfile } from '@/types/writingStyle';
import { useAuth } from '@/context/auth';
import { useWritingStyleApi, WritingStyleUpdateInput } from './api/useWritingStyleApi';

/**
 * Hook for managing writing style form state and operations
 */
export function useWritingStyleForm(initialProfile: WritingStyleProfile | TestWritingStyleProfile | null) {
  const { user } = useAuth();
  const { createWritingStyleProfile, updateWritingStyleProfile, isLoading: isSaving } = useWritingStyleApi();
  
  // Initialize form state from profile or with empty values
  const [formState, setFormState] = useState<Partial<WritingStyleProfile>>({
    voiceAnalysis: initialProfile?.voiceAnalysis || '',
    generalStyleGuide: initialProfile?.generalStyleGuide || '',
    linkedinStyleGuide: initialProfile?.linkedinStyleGuide || '',
    newsletterStyleGuide: initialProfile?.newsletterStyleGuide || '',
    marketingStyleGuide: initialProfile?.marketingStyleGuide || '',
    vocabularyPatterns: initialProfile?.vocabularyPatterns || '',
    avoidPatterns: initialProfile?.avoidPatterns || '',
  });

  // Update form state when profile changes
  if (initialProfile && !formState.id) {
    setFormState({
      ...formState,
      id: initialProfile.id,
      voiceAnalysis: initialProfile.voiceAnalysis || formState.voiceAnalysis,
      generalStyleGuide: initialProfile.generalStyleGuide || formState.generalStyleGuide,
      linkedinStyleGuide: initialProfile.linkedinStyleGuide || formState.linkedinStyleGuide,
      newsletterStyleGuide: initialProfile.newsletterStyleGuide || formState.newsletterStyleGuide,
      marketingStyleGuide: initialProfile.marketingStyleGuide || formState.marketingStyleGuide,
      vocabularyPatterns: initialProfile.vocabularyPatterns || formState.vocabularyPatterns,
      avoidPatterns: initialProfile.avoidPatterns || formState.avoidPatterns,
    });
  }

  /**
   * Handle input changes
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Get a combined profile for preview purposes
   */
  const getPreviewProfile = () => {
    return {
      ...initialProfile,
      ...formState,
      // Ensure required fields are present
      user_id: initialProfile?.user_id || user?.id || '',
      userId: initialProfile?.userId || user?.id || '',
    };
  };

  /**
   * Save the writing style profile
   */
  const saveWritingStyle = async () => {
    if (!user) {
      toast.error('You must be logged in to save your writing style');
      return;
    }

    try {
      // Create new profile update data
      const updateData: WritingStyleUpdateInput = {
        voiceAnalysis: formState.voiceAnalysis || '',
        generalStyleGuide: formState.generalStyleGuide || '',
        linkedinStyleGuide: formState.linkedinStyleGuide || '',
        newsletterStyleGuide: formState.newsletterStyleGuide || '',
        marketingStyleGuide: formState.marketingStyleGuide || '',
        vocabularyPatterns: formState.vocabularyPatterns || '',
        avoidPatterns: formState.avoidPatterns || '',
      };

      if (initialProfile?.id) {
        // Update existing profile
        await updateWritingStyleProfile(initialProfile.id, updateData);
      } else {
        // Create new profile
        await createWritingStyleProfile(updateData as any);
      }
      
      toast.success('Writing style saved successfully');
    } catch (error) {
      console.error('Error saving writing style:', error);
      toast.error('Failed to save writing style: ' + (error.message || 'Unknown error'));
    }
  };

  return {
    formState,
    handleInputChange,
    saveWritingStyle,
    isSaving,
    getPreviewProfile
  };
}
