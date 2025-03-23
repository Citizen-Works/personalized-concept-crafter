
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTanstackApiQuery } from './useTanstackApiQuery';
import { User } from '@/types/user';
import { processApiResponse, prepareApiRequest } from '@/utils/apiResponseUtils';

export function useUserProfileApi() {
  const { createQuery, createMutation, invalidateQueries } = useTanstackApiQuery('UserProfileApi');
  const profilesQueryKey = ['user-profile'];

  // Fetch user profile
  const fetchUserProfile = createQuery<User | null>(
    async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabase.auth.getUser()?.data?.user?.id || '')
        .single();
      
      if (error) throw error;
      if (!data) return null;

      // Return the user profile with proper type
      return {
        id: data.id,
        email: '', // Not stored in profiles table
        name: data.name || '',
        businessName: data.business_name || '',
        businessDescription: data.business_description || '',
        linkedinUrl: data.linkedin_url || '',
        jobTitle: data.job_title || '',
        createdAt: new Date(data.created_at)
      };
    },
    'fetch-user-profile',
    {
      queryKey: profilesQueryKey,
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  );

  // Update user profile
  const updateUserProfile = createMutation<User, Partial<User>>(
    async (profileData) => {
      const userId = supabase.auth.getUser()?.data?.user?.id;
      if (!userId) throw new Error('User not authenticated');

      // Transform data for API request
      const requestData = prepareApiRequest({
        name: profileData.name,
        businessName: profileData.businessName,
        businessDescription: profileData.businessDescription,
        linkedinUrl: profileData.linkedinUrl,
        jobTitle: profileData.jobTitle,
      });

      const { data, error } = await supabase
        .from('profiles')
        .update(requestData)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Failed to update profile');

      // Return the updated user profile with proper type
      return {
        id: data.id,
        email: '', // Not stored in profiles table
        name: data.name || '',
        businessName: data.business_name || '',
        businessDescription: data.business_description || '',
        linkedinUrl: data.linkedin_url || '',
        jobTitle: data.job_title || '',
        createdAt: new Date(data.created_at)
      };
    },
    'update-user-profile',
    {
      onSuccess: () => {
        invalidateQueries(profilesQueryKey);
      },
      successMessage: 'Profile updated successfully',
    }
  );

  return {
    fetchUserProfile,
    updateUserProfile,
  };
}
