
import { useState, useEffect, useCallback } from 'react';
import { WritingStyleProfile } from '@/types/writingStyle';
import { fetchWritingStyleProfile } from '@/services/profile';
import { saveWritingStyleProfile } from '@/services/writingStyleService';
import { toast } from 'sonner';
import { useAuth } from '@/context/auth';

export const useWritingStyle = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<WritingStyleProfile>({
    user_id: user?.id || '',
    voice_analysis: '',
    general_style_guide: '',
    linkedin_style_guide: '',
    newsletter_style_guide: '',
    marketing_style_guide: '',
    vocabulary_patterns: '',
    avoid_patterns: '',
    voiceAnalysis: '',
    generalStyleGuide: '',
    linkedinStyleGuide: '',
    newsletterStyleGuide: '',
    marketingStyleGuide: '',
    vocabularyPatterns: '',
    avoidPatterns: '',
  });

  const loadProfile = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const data = await fetchWritingStyleProfile(user.id);
      
      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error in loadProfile:', error);
      toast.error('Failed to load writing style profile');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => {
      // Update both camelCase and snake_case versions if needed
      if (name === 'voiceAnalysis') return { ...prev, voiceAnalysis: value, voice_analysis: value };
      if (name === 'generalStyleGuide') return { ...prev, generalStyleGuide: value, general_style_guide: value };
      if (name === 'linkedinStyleGuide') return { ...prev, linkedinStyleGuide: value, linkedin_style_guide: value };
      if (name === 'newsletterStyleGuide') return { ...prev, newsletterStyleGuide: value, newsletter_style_guide: value };
      if (name === 'marketingStyleGuide') return { ...prev, marketingStyleGuide: value, marketing_style_guide: value };
      if (name === 'vocabularyPatterns') return { ...prev, vocabularyPatterns: value, vocabulary_patterns: value };
      if (name === 'avoidPatterns') return { ...prev, avoidPatterns: value, avoid_patterns: value };
      
      return { ...prev, [name]: value };
    });
  };

  const saveProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      await saveWritingStyleProfile(profile);
      toast.success('Writing style profile saved successfully');
    } catch (error) {
      console.error('Error in saveProfile:', error);
      toast.error('Failed to save writing style profile');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user, loadProfile]);

  return {
    profile,
    isLoading,
    isSaving,
    handleChange,
    saveProfile,
    writingStyle: profile, // Add this alias for backward compatibility
    refetch: loadProfile // Expose the loadProfile function as refetch
  };
};
