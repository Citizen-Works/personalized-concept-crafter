
import { useState, useEffect } from 'react';
import { WritingStyleProfile } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

export const useWritingStyleForm = (initialProfile?: Partial<WritingStyleProfile>) => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  
  const [formState, setFormState] = useState<Partial<WritingStyleProfile>>({
    voiceAnalysis: '',
    generalStyleGuide: '',
    vocabularyPatterns: '',
    avoidPatterns: '',
    linkedinStyleGuide: '',
    newsletterStyleGuide: '',
    marketingStyleGuide: '',
  });
  
  useEffect(() => {
    if (initialProfile) {
      setFormState({
        voiceAnalysis: initialProfile.voiceAnalysis || '',
        generalStyleGuide: initialProfile.generalStyleGuide || '',
        vocabularyPatterns: initialProfile.vocabularyPatterns || '',
        avoidPatterns: initialProfile.avoidPatterns || '',
        linkedinStyleGuide: initialProfile.linkedinStyleGuide || '',
        newsletterStyleGuide: initialProfile.newsletterStyleGuide || '',
        marketingStyleGuide: initialProfile.marketingStyleGuide || '',
      });
    }
  }, [initialProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveWritingStyle = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      if (initialProfile?.id) {
        // Update existing writing style
        await supabase
          .from('writing_style_profiles')
          .update({
            voice_analysis: formState.voiceAnalysis,
            general_style_guide: formState.generalStyleGuide,
            vocabulary_patterns: formState.vocabularyPatterns,
            avoid_patterns: formState.avoidPatterns,
            linkedin_style_guide: formState.linkedinStyleGuide,
            newsletter_style_guide: formState.newsletterStyleGuide,
            marketing_style_guide: formState.marketingStyleGuide,
          })
          .eq('id', initialProfile.id);
      } else {
        // Create new writing style
        await supabase
          .from('writing_style_profiles')
          .insert({
            user_id: user.id,
            voice_analysis: formState.voiceAnalysis,
            general_style_guide: formState.generalStyleGuide,
            vocabulary_patterns: formState.vocabularyPatterns,
            avoid_patterns: formState.avoidPatterns,
            linkedin_style_guide: formState.linkedinStyleGuide,
            newsletter_style_guide: formState.newsletterStyleGuide,
            marketing_style_guide: formState.marketingStyleGuide,
            example_quotes: [],
            linkedin_examples: [],
            newsletter_examples: [],
            marketing_examples: [],
          });
      }
      
      toast.success('Writing style saved successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error saving writing style:', error);
      toast.error('Failed to save writing style');
    } finally {
      setIsSaving(false);
    }
  };

  // Create a preview object that includes fields for the WritingStylePreview component
  const getPreviewProfile = () => {
    return {
      // Use camelCase properties that match the type definition
      userId: user?.id || '',
      voiceAnalysis: formState.voiceAnalysis || '',
      generalStyleGuide: formState.generalStyleGuide || '',
      linkedinStyleGuide: formState.linkedinStyleGuide || '',
      newsletterStyleGuide: formState.newsletterStyleGuide || '',
      marketingStyleGuide: formState.marketingStyleGuide || '',
      vocabularyPatterns: formState.vocabularyPatterns || '',
      avoidPatterns: formState.avoidPatterns || '',
      
      // Include the snake_case aliases for database operations
      user_id: user?.id || '',
      voice_analysis: formState.voiceAnalysis || '',
      general_style_guide: formState.generalStyleGuide || '',
      linkedin_style_guide: formState.linkedinStyleGuide || '',
      newsletter_style_guide: formState.newsletterStyleGuide || '',
      marketing_style_guide: formState.marketingStyleGuide || '',
      vocabulary_patterns: formState.vocabularyPatterns || '',
      avoid_patterns: formState.avoidPatterns || '',
      
      // Optional properties with empty defaults
      id: initialProfile?.id || '',
      exampleQuotes: [],
      linkedinExamples: [],
      newsletterExamples: [],
      marketingExamples: [],
      createdAt: initialProfile?.createdAt || new Date(),
      updatedAt: initialProfile?.updatedAt || new Date()
    };
  };

  return {
    formState,
    handleInputChange,
    saveWritingStyle,
    isSaving,
    getPreviewProfile
  };
};
