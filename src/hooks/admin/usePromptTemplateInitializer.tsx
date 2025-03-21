
import { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { extractAndGenerateBaseTemplates } from '@/services/admin/promptGeneratorService';

// This hook should be used once at app initialization to ensure prompt templates exist
export function usePromptTemplateInitializer() {
  const { isAdmin, user } = useAuth();
  
  useEffect(() => {
    // Only run this if the user is an admin
    if (isAdmin && user) {
      // Initialize templates if needed
      extractAndGenerateBaseTemplates().catch(console.error);
    }
  }, [isAdmin, user]);
}
