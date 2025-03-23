
import { supabase } from '@/integrations/supabase/client';
import { processApiResponse } from '@/utils/apiResponseUtils';

// Define User type directly based on the existing structure in the codebase
interface User {
  id: string;
  email: string;
  name: string;
  businessName: string;
  businessDescription: string;
  linkedinUrl: string;
  jobTitle: string;
  createdAt: Date;
}

/**
 * Fetches the user profile
 */
export async function fetchUserProfile(userId: string): Promise<User | null> {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    if (!profile) return null;
    
    // Process response to ensure consistent property naming
    const transformedData = processApiResponse(profile);
    
    return {
      id: transformedData.id,
      email: '', // Not stored in profiles table
      name: transformedData.name || '',
      businessName: transformedData.businessName || '',
      businessDescription: transformedData.businessDescription || '',
      linkedinUrl: transformedData.linkedinUrl || '',
      jobTitle: transformedData.jobTitle || '',
      createdAt: new Date(transformedData.createdAt)
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}
