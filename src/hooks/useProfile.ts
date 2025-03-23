
import { useState, useCallback } from 'react';
import { useUserProfileApi } from './api/useUserProfileApi';
import { useUserSettingsApi } from './api/useUserSettingsApi';
import { useAuth } from '@/context/auth';
import { toast } from 'sonner';
import { User } from '@/types/user';

export function useProfile() {
  const { user: authUser } = useAuth();
  const { fetchUserProfile, updateUserProfile } = useUserProfileApi();
  const { fetchUserSettings, updateUserSettings } = useUserSettingsApi();
  
  // Extract data from the queries
  const profile = fetchUserProfile.data;
  const isLoading = fetchUserProfile.isLoading || fetchUserSettings.isLoading;
  const settings = fetchUserSettings.data;
  
  // Save profile data
  const saveProfile = useCallback(async (profileData: Partial<User>) => {
    if (!authUser?.id) {
      toast.error("You must be logged in to update your profile");
      return;
    }
    
    try {
      await updateUserProfile.mutateAsync(profileData);
    } catch (error) {
      console.error('Error saving profile:', error);
      // Error handling is already done in the mutation
    }
  }, [authUser?.id, updateUserProfile]);
  
  // Combine profile and settings data from Supabase with auth user info
  const combinedProfile = {
    ...profile,
    email: authUser?.email || '',
    id: authUser?.id || '',
    settings: settings || {}
  };
  
  return {
    profile: combinedProfile,
    settings,
    isLoading,
    saveProfile,
    updateSettings: updateUserSettings.mutate,
    isSaving: updateUserProfile.isPending || updateUserSettings.isPending,
    refetch: () => {
      fetchUserProfile.refetch();
      fetchUserSettings.refetch();
    }
  };
}
