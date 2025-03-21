
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type UserSettings = {
  id?: string;
  user_id?: string;
  custom_instructions?: string;
  api_key?: string;
  webhook_url?: string;
  notification_email?: boolean;
  notification_app?: boolean;
  created_at?: string;
  updated_at?: string;
};

export const useUserSettings = () => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  const fetchSettings = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Instead of using .from('user_settings'), we'll use a more direct query
      // since user_settings is not in the Supabase schema types
      const { data, error } = await supabase
        .rpc('get_user_settings', { user_id_param: user.id });
      
      if (error) {
        console.error('Error fetching user settings:', error);
        toast.error('Failed to load settings');
        setSettings({ user_id: user.id });
      } else {
        setSettings(data || { user_id: user.id });
      }
    } catch (error) {
      console.error('Error fetching user settings:', error);
      toast.error('Failed to load settings');
      setSettings({ user_id: user.id });
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const saveSettings = useCallback(async (updatedSettings: Partial<UserSettings>) => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      const settingsData = {
        ...updatedSettings,
        user_id: user.id,
      };
      
      // Use RPC for update operations as well
      const response = await supabase
        .rpc('save_user_settings', { 
          settings_data: settingsData,
          user_id_param: user.id
        });
      
      if (response.error) throw response.error;
      
      toast.success('Settings saved successfully');
      await fetchSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  }, [user, fetchSettings]);

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user, fetchSettings]);

  return {
    settings,
    isLoading,
    isSaving,
    saveSettings,
    refetch: fetchSettings
  };
};
