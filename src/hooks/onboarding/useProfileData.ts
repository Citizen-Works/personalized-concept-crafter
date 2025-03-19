
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ProfileData } from '@/services/onboardingAssistantService';
import { fetchUserProfile } from '@/services/profile';
import { fetchContentPillars } from '@/services/profile';
import { fetchTargetAudiences } from '@/services/profile';
import { fetchWritingStyleProfile } from '@/services/profile/writingStyleService';

export function useProfileData() {
  const [existingProfileData, setExistingProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Fetch existing profile data
  const fetchExistingProfileData = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      
      const [userProfile, contentPillars, targetAudiences, writingStyle] = await Promise.all([
        fetchUserProfile(user.id),
        fetchContentPillars(user.id),
        fetchTargetAudiences(user.id),
        fetchWritingStyleProfile(user.id)
      ]);
      
      setExistingProfileData({
        userProfile: userProfile || {},
        contentPillars: contentPillars || [],
        targetAudiences: targetAudiences || [],
        writingStyle: writingStyle || {}
      });
    } catch (error) {
      console.error('Error fetching existing profile data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);
  
  useEffect(() => {
    fetchExistingProfileData();
  }, [fetchExistingProfileData]);

  return {
    existingProfileData,
    isLoading
  };
}
