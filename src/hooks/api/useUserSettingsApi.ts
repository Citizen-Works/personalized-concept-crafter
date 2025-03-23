
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTanstackApiQuery } from './useTanstackApiQuery';
import { processApiResponse, prepareApiRequest } from '@/utils/apiResponseUtils';

export type UserSettings = {
  id?: string;
  userId?: string;
  customInstructions?: string;
  apiKey?: string;
  webhookUrl?: string;
  notificationEmail?: boolean;
  notificationApp?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export function useUserSettingsApi() {
  const { createQuery, createMutation, invalidateQueries } = useTanstackApiQuery('UserSettingsApi');
  const settingsQueryKey = ['user-settings'];

  // Fetch user settings
  const fetchUserSettings = createQuery<UserSettings | null>(
    async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;
      if (!userId) return null;

      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) return null;

      // Return the user settings with proper type
      return {
        id: data.id,
        userId: data.user_id,
        customInstructions: data.custom_instructions,
        apiKey: data.api_key,
        webhookUrl: data.webhook_url,
        notificationEmail: data.notification_email,
        notificationApp: data.notification_app,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    },
    'fetch-user-settings',
    {
      queryKey: settingsQueryKey,
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  );

  // Update user settings
  const updateUserSettings = createMutation<UserSettings, Partial<UserSettings>>(
    async (settingsData) => {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;
      if (!userId) throw new Error('User not authenticated');

      // Prepare data for API
      const requestData = prepareApiRequest({
        ...settingsData,
        userId: userId,
      });

      let response;
      
      if (settingsData.id) {
        // Update existing record
        response = await supabase
          .from('user_settings')
          .update(requestData)
          .eq('id', settingsData.id)
          .select()
          .single();
      } else {
        // Insert new record
        response = await supabase
          .from('user_settings')
          .insert([{ ...requestData, user_id: userId }])
          .select()
          .single();
      }
      
      if (response.error) throw response.error;
      if (!response.data) throw new Error('Failed to update settings');

      // Return the updated settings with proper type
      return {
        id: response.data.id,
        userId: response.data.user_id,
        customInstructions: response.data.custom_instructions,
        apiKey: response.data.api_key,
        webhookUrl: response.data.webhook_url,
        notificationEmail: response.data.notification_email,
        notificationApp: response.data.notification_app,
        createdAt: new Date(response.data.created_at),
        updatedAt: new Date(response.data.updated_at)
      };
    },
    'update-user-settings',
    {
      onSuccess: () => {
        invalidateQueries(settingsQueryKey);
      },
      successMessage: 'Settings saved successfully',
    }
  );

  return {
    fetchUserSettings,
    updateUserSettings,
  };
}
