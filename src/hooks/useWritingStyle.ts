import { useState, useEffect } from 'react';
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

  const loadProfile = async () => {
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
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
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

  const refetch = loadProfile;

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  return {
    profile,
    isLoading,
    isSaving,
    handleChange,
    saveProfile,
    writingStyle: profile, // Add this alias for backward compatibility
    refetch // Add this for compatibility
  };
};
