
// This file now exports redirects to the new API hooks structure
// for backward compatibility
import { useProfile } from '@/hooks/useProfile';
import { useUserProfileApi } from '@/hooks/api/useUserProfileApi';

// Export the standardized hooks for use in the application
export { useProfile } from '@/hooks/useProfile';

// For backward compatibility with existing code, re-export functions with the same signatures
export async function fetchUserProfile(userId: string) {
  // This implementation is now just for backward compatibility
  console.warn('fetchUserProfile is deprecated. Please use useProfile hook instead.');
  
  try {
    // Create a one-off instance of the hook to call the API
    const api = new (useUserProfileApi as any)();
    const response = await api.fetchUserProfile.queryFn();
    return response;
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    return null;
  }
}

// Add additional backward compatibility functions as needed
export { fetchContentPillars } from './contentPillarService';
export { fetchTargetAudiences } from './targetAudienceService';
export { fetchWritingStyleProfile } from './writingStyleService';
