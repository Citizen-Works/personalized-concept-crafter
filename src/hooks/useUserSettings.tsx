
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';

export interface UserSettings {
  custom_instructions: string | null;
  default_content_type: string | null;
  content_length_preference: string;
  use_personal_examples: boolean;
}

export const useUserSettings = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<UserSettings>({
    custom_instructions: null,
    default_content_type: 'linkedin',
    content_length_preference: 'medium',
    use_personal_examples: true
  });

  // For now this is a simple hook with default values
  // In a real implementation, this would fetch settings from the database
  useEffect(() => {
    if (user) {
      setIsLoading(false);
    }
  }, [user]);

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    return true;
  };

  return {
    settings,
    isLoading,
    updateSettings
  };
};
