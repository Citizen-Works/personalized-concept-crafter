
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches business context information for a user to provide additional
 * context for content generation
 */
export const fetchBusinessContext = async (userId: string): Promise<string> => {
  try {
    // Get user's business info from profiles table
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("business_name, business_description")
      .eq("id", userId)
      .single();
      
    if (profileError) {
      console.warn("Could not retrieve user business info:", profileError);
      return '';
    }
    
    // Prepare business context
    return profileData ? 
      `\nBusiness Context:
      Business Name: ${profileData.business_name || 'Not specified'}
      Business Description: ${profileData.business_description || 'Not specified'}\n` : '';
  } catch (error) {
    console.error("Error fetching business context:", error);
    return '';
  }
};
