
import { supabase } from '@/integrations/supabase/client';
import { ProfileData } from './onboardingAssistantService';
import { toast } from 'sonner';

/**
 * Saves user profile data to Supabase
 */
export async function saveProfileData(userId: string, profileData: ProfileData): Promise<boolean> {
  try {
    // Save user profile information
    if (profileData.userProfile && Object.keys(profileData.userProfile).length > 0) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          business_name: profileData.userProfile.businessName,
          business_description: profileData.userProfile.businessDescription,
          job_title: profileData.userProfile.jobTitle,
          linkedin_url: profileData.userProfile.linkedinUrl
        })
        .eq('id', userId);
      
      if (profileError) throw profileError;
    }
    
    // Save content pillars
    if (profileData.contentPillars && profileData.contentPillars.length > 0) {
      // First, get existing pillars to determine what to update/insert
      const { data: existingPillars, error: fetchError } = await supabase
        .from('content_pillars')
        .select('id')
        .eq('user_id', userId);
      
      if (fetchError) throw fetchError;
      
      // Upsert content pillars
      for (let i = 0; i < profileData.contentPillars.length; i++) {
        const pillar = profileData.contentPillars[i];
        const existingId = existingPillars && i < existingPillars.length ? existingPillars[i].id : null;
        
        if (existingId) {
          // Update existing pillar
          const { error } = await supabase
            .from('content_pillars')
            .update({
              name: pillar.name,
              description: pillar.description
            })
            .eq('id', existingId);
          
          if (error) throw error;
        } else {
          // Insert new pillar
          const { error } = await supabase
            .from('content_pillars')
            .insert({
              user_id: userId,
              name: pillar.name,
              description: pillar.description
            });
          
          if (error) throw error;
        }
      }
      
      // Delete extra existing pillars if there are more existing than new ones
      if (existingPillars && existingPillars.length > profileData.contentPillars.length) {
        const idsToKeep = existingPillars.slice(0, profileData.contentPillars.length).map(p => p.id);
        
        const { error } = await supabase
          .from('content_pillars')
          .delete()
          .eq('user_id', userId)
          .not('id', 'in', `(${idsToKeep.join(',')})`);
        
        if (error) throw error;
      }
    }
    
    // Save target audiences
    if (profileData.targetAudiences && profileData.targetAudiences.length > 0) {
      // First, get existing audiences to determine what to update/insert
      const { data: existingAudiences, error: fetchError } = await supabase
        .from('target_audiences')
        .select('id')
        .eq('user_id', userId);
      
      if (fetchError) throw fetchError;
      
      // Upsert target audiences
      for (let i = 0; i < profileData.targetAudiences.length; i++) {
        const audience = profileData.targetAudiences[i];
        const existingId = existingAudiences && i < existingAudiences.length ? existingAudiences[i].id : null;
        
        if (existingId) {
          // Update existing audience
          const { error } = await supabase
            .from('target_audiences')
            .update({
              name: audience.name,
              description: audience.description,
              pain_points: audience.painPoints,
              goals: audience.goals
            })
            .eq('id', existingId);
          
          if (error) throw error;
        } else {
          // Insert new audience
          const { error } = await supabase
            .from('target_audiences')
            .insert({
              user_id: userId,
              name: audience.name,
              description: audience.description,
              pain_points: audience.painPoints,
              goals: audience.goals
            });
          
          if (error) throw error;
        }
      }
      
      // Delete extra existing audiences if there are more existing than new ones
      if (existingAudiences && existingAudiences.length > profileData.targetAudiences.length) {
        const idsToKeep = existingAudiences.slice(0, profileData.targetAudiences.length).map(a => a.id);
        
        const { error } = await supabase
          .from('target_audiences')
          .delete()
          .eq('user_id', userId)
          .not('id', 'in', `(${idsToKeep.join(',')})`);
        
        if (error) throw error;
      }
    }
    
    // Save writing style profile
    if (profileData.writingStyle && Object.keys(profileData.writingStyle).length > 0) {
      // Check if writing style profile exists
      const { data, error: fetchError } = await supabase
        .from('writing_style_profiles')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (fetchError) throw fetchError;
      
      if (data?.id) {
        // Update existing profile
        const { error } = await supabase
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
          .eq('id', data.id);
        
        if (error) throw error;
      } else {
        // Insert new profile
        const { error } = await supabase
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
        
        if (error) throw error;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error saving profile data:', error);
    toast.error('Failed to save profile data');
    return false;
  }
}
