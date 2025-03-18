
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';

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
    
    return {
      id: profile.id,
      email: '', // Not stored in profiles table
      name: profile.name || '',
      businessName: profile.business_name || '',
      businessDescription: profile.business_description || '',
      linkedinUrl: profile.linkedin_url || '',
      jobTitle: profile.job_title || '',
      createdAt: new Date(profile.created_at)
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}
