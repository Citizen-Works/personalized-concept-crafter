
import { useState } from 'react';
import { WritingStyleProfile } from '@/types/writingStyle';
import { useAuth } from '@/context/auth';
import { useWritingStyleAdapter } from './api/adapters/useWritingStyleAdapter';
import { toast } from 'sonner';

export function useWritingStyleForm(initialProfile: WritingStyleProfile | null = null) {
  const { user } = useAuth();
  const {
    saveWritingStyleProfile,
    isLoading
  } = useWritingStyleAdapter();

  // Initialize form state with initial profile or empty values
  const [formState, setFormState] = useState<WritingStyleProfile>({
    id: initialProfile?.id || undefined,
    userId: user?.id || '',
    user_id: user?.id || '',  // Include both formats for consistency
    voiceAnalysis: initialProfile?.voiceAnalysis || initialProfile?.voice_analysis || '',
    voice_analysis: initialProfile?.voiceAnalysis || initialProfile?.voice_analysis || '',
    generalStyleGuide: initialProfile?.generalStyleGuide || initialProfile?.general_style_guide || '',
    general_style_guide: initialProfile?.generalStyleGuide || initialProfile?.general_style_guide || '',
    linkedinStyleGuide: initialProfile?.linkedinStyleGuide || initialProfile?.linkedin_style_guide || '',
    linkedin_style_guide: initialProfile?.linkedinStyleGuide || initialProfile?.linkedin_style_guide || '',
    newsletterStyleGuide: initialProfile?.newsletterStyleGuide || initialProfile?.newsletter_style_guide || '',
    newsletter_style_guide: initialProfile?.newsletterStyleGuide || initialProfile?.newsletter_style_guide || '',
    marketingStyleGuide: initialProfile?.marketingStyleGuide || initialProfile?.marketing_style_guide || '',
    marketing_style_guide: initialProfile?.marketingStyleGuide || initialProfile?.marketing_style_guide || '',
    vocabularyPatterns: initialProfile?.vocabularyPatterns || initialProfile?.vocabulary_patterns || '',
    vocabulary_patterns: initialProfile?.vocabularyPatterns || initialProfile?.vocabulary_patterns || '',
    avoidPatterns: initialProfile?.avoidPatterns || initialProfile?.avoid_patterns || '',
    avoid_patterns: initialProfile?.avoidPatterns || initialProfile?.avoid_patterns || ''
  });

  const [isSaving, setIsSaving] = useState(false);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => {
      const update = { ...prev, [name]: value };
      
      // Update the corresponding snake_case field for database consistency
      if (name === 'voiceAnalysis') update.voice_analysis = value;
      if (name === 'generalStyleGuide') update.general_style_guide = value;
      if (name === 'linkedinStyleGuide') update.linkedin_style_guide = value;
      if (name === 'newsletterStyleGuide') update.newsletter_style_guide = value;
      if (name === 'marketingStyleGuide') update.marketing_style_guide = value;
      if (name === 'vocabularyPatterns') update.vocabulary_patterns = value;
      if (name === 'avoidPatterns') update.avoid_patterns = value;
      
      return update;
    });
  };

  // Save writing style profile
  const saveWritingStyle = async () => {
    if (!user) {
      toast.error('You must be logged in to save your writing style');
      return;
    }

    setIsSaving(true);
    try {
      await saveWritingStyleProfile(formState);
      toast.success('Writing style saved successfully');
    } catch (error) {
      console.error('Error saving writing style:', error);
      toast.error('Failed to save writing style');
    } finally {
      setIsSaving(false);
    }
  };

  // Get preview profile (for writing style preview tab)
  const getPreviewProfile = (): WritingStyleProfile => {
    return {
      ...formState,
      userId: user?.id || '',
      user_id: user?.id || ''
    };
  };

  return {
    formState,
    handleInputChange,
    saveWritingStyle,
    isSaving,
    isLoading,
    getPreviewProfile
  };
}
