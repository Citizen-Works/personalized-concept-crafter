
import { supabase } from '@/integrations/supabase/client';
import { ProfileData } from './onboardingAssistantService';

/**
 * Saves the profile data extracted from the onboarding conversation
 */
export async function saveProfileData(userId: string, profileData: ProfileData): Promise<boolean> {
  try {
    // Start a transaction by saving all data in sequence
    
    // 1. Update user profile
    if (profileData.userProfile) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          business_name: profileData.userProfile.businessName,
          business_description: profileData.userProfile.businessDescription,
          job_title: profileData.userProfile.jobTitle,
          linkedin_url: profileData.userProfile.linkedinUrl,
        })
        .eq('id', userId);
      
      if (profileError) {
        console.error('Error updating profile:', profileError);
        throw profileError;
      }
    }
    
    // 2. Add content pillars
    if (profileData.contentPillars && profileData.contentPillars.length > 0) {
      // First, delete existing pillars (simplest approach to ensure clean data)
      const { error: deleteError } = await supabase
        .from('content_pillars')
        .delete()
        .eq('user_id', userId);
      
      if (deleteError) {
        console.error('Error deleting existing pillars:', deleteError);
        throw deleteError;
      }
      
      // Then, add new pillars
      const pillarsToInsert = profileData.contentPillars.map(pillar => ({
        user_id: userId,
        name: pillar.name,
        description: pillar.description
      }));
      
      const { error: insertError } = await supabase
        .from('content_pillars')
        .insert(pillarsToInsert);
      
      if (insertError) {
        console.error('Error inserting content pillars:', insertError);
        throw insertError;
      }
    }
    
    // 3. Add target audiences
    if (profileData.targetAudiences && profileData.targetAudiences.length > 0) {
      // First, delete existing audiences
      const { error: deleteError } = await supabase
        .from('target_audiences')
        .delete()
        .eq('user_id', userId);
      
      if (deleteError) {
        console.error('Error deleting existing audiences:', deleteError);
        throw deleteError;
      }
      
      // Then, add new audiences
      const audiencesToInsert = profileData.targetAudiences.map(audience => ({
        user_id: userId,
        name: audience.name,
        description: audience.description,
        pain_points: audience.painPoints,
        goals: audience.goals
      }));
      
      const { error: insertError } = await supabase
        .from('target_audiences')
        .insert(audiencesToInsert);
      
      if (insertError) {
        console.error('Error inserting target audiences:', insertError);
        throw insertError;
      }
    }
    
    // 4. Add writing style profile
    if (profileData.writingStyle) {
      // Check if writing style profile exists
      const { data: existingStyle, error: checkError } = await supabase
        .from('writing_style_profiles')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (checkError) {
        console.error('Error checking writing style profile:', checkError);
        throw checkError;
      }
      
      if (existingStyle) {
        // Update existing writing style profile
        const { error: updateError } = await supabase
          .from('writing_style_profiles')
          .update({
            voice_analysis: profileData.writingStyle.voiceAnalysis,
            general_style_guide: profileData.writingStyle.generalStyleGuide,
            linkedin_style_guide: profileData.writingStyle.linkedinStyleGuide,
            newsletter_style_guide: profileData.writingStyle.newsletterStyleGuide,
            marketing_style_guide: profileData.writingStyle.marketingStyleGuide,
            vocabulary_patterns: profileData.writingStyle.vocabularyPatterns,
            avoid_patterns: profileData.writingStyle.avoidPatterns
          })
          .eq('user_id', userId);
        
        if (updateError) {
          console.error('Error updating writing style profile:', updateError);
          throw updateError;
        }
      } else {
        // Insert new writing style profile
        const { error: insertError } = await supabase
          .from('writing_style_profiles')
          .insert({
            user_id: userId,
            voice_analysis: profileData.writingStyle.voiceAnalysis,
            general_style_guide: profileData.writingStyle.generalStyleGuide,
            linkedin_style_guide: profileData.writingStyle.linkedinStyleGuide,
            newsletter_style_guide: profileData.writingStyle.newsletterStyleGuide,
            marketing_style_guide: profileData.writingStyle.marketingStyleGuide,
            vocabulary_patterns: profileData.writingStyle.vocabularyPatterns,
            avoid_patterns: profileData.writingStyle.avoidPatterns
          });
        
        if (insertError) {
          console.error('Error inserting writing style profile:', insertError);
          throw insertError;
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error saving profile data:', error);
    return false;
  }
}
