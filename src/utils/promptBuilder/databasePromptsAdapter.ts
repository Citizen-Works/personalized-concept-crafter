import { supabase } from "@/integrations/supabase/client";
import { getPromptTemplate } from '@/services/admin/promptGeneratorService';

/**
 * This file bridges the gap between the database-stored prompt templates
 * and the code-based prompt builder system.
 */

// Function to get user profile data
export async function getUserProfile(userId: string) {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return {
    businessName: profile.business_name,
    jobTitle: profile.job_title,
    businessDescription: profile.business_description,
    // Other fields as needed
  };
}

// Function to get content pillars
export async function getContentPillars(userId: string) {
  const { data, error } = await supabase
    .from('content_pillars')
    .select('*')
    .eq('user_id', userId)
    .eq('is_archived', false);
  
  if (error) {
    console.error('Error fetching content pillars:', error);
    return [];
  }
  
  return data.map(pillar => ({
    id: pillar.id,
    name: pillar.name,
    description: pillar.description,
  }));
}

// Function to get target audiences
export async function getTargetAudiences(userId: string) {
  const { data, error } = await supabase
    .from('target_audiences')
    .select('*')
    .eq('user_id', userId)
    .eq('is_archived', false);
  
  if (error) {
    console.error('Error fetching target audiences:', error);
    return [];
  }
  
  return data.map(audience => ({
    id: audience.id,
    name: audience.name,
    description: audience.description,
    painPoints: audience.pain_points ? audience.pain_points : [],
    goals: audience.goals ? audience.goals : [],
  }));
}

// Function to get writing style
export async function getWritingStyle(userId: string) {
  const { data, error } = await supabase
    .from('writing_style_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching writing style:', error);
    return null;
  }
  
  if (!data) return null;
  
  return {
    voiceAnalysis: data.voice_analysis,
    generalStyleGuide: data.general_style_guide,
    linkedinStyleGuide: data.linkedin_style_guide,
    newsletterStyleGuide: data.newsletter_style_guide,
    marketingStyleGuide: data.marketing_style_guide,
    vocabularyPatterns: data.vocabulary_patterns,
    avoidPatterns: data.avoid_patterns,
  };
}

// Main function to build a prompt from database templates
export async function buildDatabasePrompt(templateKeys: string[], templateVars: any = {}) {
  // Fetch all requested templates
  const templatePromises = templateKeys.map(key => getPromptTemplate(key));
  const templates = await Promise.all(templatePromises);
  
  // Combine templates
  let combinedTemplate = templates.join('\n\n');
  
  // Replace variables in the template
  Object.entries(templateVars).forEach(([key, value]) => {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    combinedTemplate = combinedTemplate.replace(regex, String(value));
  });
  
  return combinedTemplate;
}
