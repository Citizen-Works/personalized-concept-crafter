import { User, ContentPillar, TargetAudience, WritingStyleProfile, LinkedinPost } from '@/types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches the user profile from Supabase
 */
export async function fetchUserProfile(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return {
    id: data.id,
    email: '',
    name: data.name || '',
    businessName: data.business_name || '',
    businessDescription: data.business_description || '',
    linkedinUrl: data.linkedin_url || '',
    jobTitle: data.job_title || '',
    createdAt: new Date(data.created_at),
  };
}

/**
 * Fetches content pillars for a user
 */
export async function fetchContentPillars(userId: string): Promise<ContentPillar[]> {
  const { data, error } = await supabase
    .from('content_pillars')
    .select('*')
    .eq('user_id', userId);
    
  if (error) {
    console.error('Error fetching content pillars:', error);
    return [];
  }
  
  return data.map(pillar => ({
    id: pillar.id,
    userId: pillar.user_id,
    name: pillar.name,
    description: pillar.description || '',
    createdAt: new Date(pillar.created_at),
  }));
}

/**
 * Fetches target audiences for a user
 */
export async function fetchTargetAudiences(userId: string): Promise<TargetAudience[]> {
  const { data, error } = await supabase
    .from('target_audiences')
    .select('*')
    .eq('user_id', userId);
    
  if (error) {
    console.error('Error fetching target audiences:', error);
    return [];
  }
  
  return data.map(audience => ({
    id: audience.id,
    userId: audience.user_id,
    name: audience.name,
    description: audience.description || '',
    painPoints: audience.pain_points || [],
    goals: audience.goals || [],
    createdAt: new Date(audience.created_at),
  }));
}

/**
 * Fetches writing style profile for a user
 */
export async function fetchWritingStyleProfile(userId: string): Promise<WritingStyleProfile | null> {
  const { data, error } = await supabase
    .from('writing_style_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
    
  if (error) {
    console.error('Error fetching writing style profile:', error);
    return null;
  }
  
  if (!data) return null;
  
  return {
    id: data.id,
    userId: data.user_id,
    voiceAnalysis: data.voice_analysis || '',
    generalStyleGuide: data.general_style_guide || '',
    exampleQuotes: data.example_quotes || [],
    vocabularyPatterns: data.vocabulary_patterns || '',
    avoidPatterns: data.avoid_patterns || '',
    customPromptInstructions: data.custom_prompt_instructions || '',
    linkedinStyleGuide: data.linkedin_style_guide || '',
    linkedinExamples: data.linkedin_examples || [],
    newsletterStyleGuide: data.newsletter_style_guide || '',
    newsletterExamples: data.newsletter_examples || [],
    marketingStyleGuide: data.marketing_style_guide || '',
    marketingExamples: data.marketing_examples || [],
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

/**
 * Fetches custom prompt instructions for a user
 */
export async function fetchCustomPromptInstructions(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('writing_style_profiles')
    .select('custom_prompt_instructions')
    .eq('user_id', userId)
    .single();
    
  if (error || !data) {
    console.error('Error fetching custom prompt instructions:', error);
    return null;
  }
  
  return data.custom_prompt_instructions;
}

/**
 * Fetches recent LinkedIn posts for a user
 */
export async function fetchRecentLinkedinPosts(userId: string, limit: number = 5): Promise<LinkedinPost[]> {
  const { data, error } = await supabase
    .from('linkedin_posts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
    
  if (error) {
    console.error('Error fetching LinkedIn posts:', error);
    return [];
  }
  
  return data.map(post => ({
    id: post.id,
    userId: post.user_id,
    content: post.content,
    publishedAt: post.published_at ? new Date(post.published_at) : undefined,
    url: post.url || '',
    createdAt: new Date(post.created_at),
  }));
}
