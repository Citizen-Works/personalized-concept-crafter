
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
      
      // Use standard query instead of RPC
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
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
      
      // Use standard query operations instead of RPC
      let response;
      
      if (settings?.id) {
        // Update existing record
        response = await supabase
          .from('user_settings')
          .update(settingsData)
          .eq('id', settings.id);
      } else {
        // Insert new record
        response = await supabase
          .from('user_settings')
          .insert([settingsData]);
      }
      
      if (response.error) throw response.error;
      
      toast.success('Settings saved successfully');
      await fetchSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  }, [user, settings, fetchSettings]);

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
