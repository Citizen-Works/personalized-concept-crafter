
import { supabase } from '@/integrations/supabase/client';
import { User, ContentPillar, TargetAudience, LinkedinPost, Document } from '@/types';
import { WritingStyleProfile } from '@/types/writingStyle';

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

/**
 * Fetches the content pillars for a user
 */
export async function fetchContentPillars(userId: string): Promise<ContentPillar[]> {
  try {
    const { data, error } = await supabase
      .from('content_pillars')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    return data.map(pillar => ({
      id: pillar.id,
      userId: pillar.user_id,
      name: pillar.name,
      description: pillar.description || '',
      createdAt: new Date(pillar.created_at)
    }));
  } catch (error) {
    console.error('Error fetching content pillars:', error);
    return [];
  }
}

/**
 * Fetches the target audiences for a user
 */
export async function fetchTargetAudiences(userId: string): Promise<TargetAudience[]> {
  try {
    const { data, error } = await supabase
      .from('target_audiences')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    return data.map(audience => ({
      id: audience.id,
      userId: audience.user_id,
      name: audience.name,
      description: audience.description || '',
      painPoints: audience.pain_points || [],
      goals: audience.goals || [],
      createdAt: new Date(audience.created_at)
    }));
  } catch (error) {
    console.error('Error fetching target audiences:', error);
    return [];
  }
}

/**
 * Fetches the writing style profile for a user
 */
export async function fetchWritingStyleProfile(userId: string): Promise<WritingStyleProfile | null> {
  try {
    const { data, error } = await supabase
      .from('writing_style_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    
    if (!data) return null;
    
    return {
      id: data.id,
      voiceAnalysis: data.voice_analysis || '',
      generalStyleGuide: data.general_style_guide || '',
      linkedinStyleGuide: data.linkedin_style_guide || '',
      newsletterStyleGuide: data.newsletter_style_guide || '',
      marketingStyleGuide: data.marketing_style_guide || '',
      vocabularyPatterns: data.vocabulary_patterns || '',
      avoidPatterns: data.avoid_patterns || '',
      userId: data.user_id,
      exampleQuotes: data.example_quotes || [],
      linkedinExamples: data.linkedin_examples || [],
      newsletterExamples: data.newsletter_examples || [],
      marketingExamples: data.marketing_examples || [],
      customPromptInstructions: data.custom_prompt_instructions || '',
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  } catch (error) {
    console.error('Error fetching writing style profile:', error);
    return null;
  }
}

/**
 * Fetches custom prompt instructions for a user
 */
export async function fetchCustomPromptInstructions(userId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('writing_style_profiles')
      .select('custom_prompt_instructions')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    
    return data?.custom_prompt_instructions || null;
  } catch (error) {
    console.error('Error fetching custom prompt instructions:', error);
    return null;
  }
}

/**
 * Fetches the most recent LinkedIn posts for a user
 */
export async function fetchRecentLinkedinPosts(userId: string, limit: number = 5): Promise<LinkedinPost[]> {
  try {
    // First try to get actual LinkedIn posts
    const { data: linkedinPosts, error: linkedinError } = await supabase
      .from('linkedin_posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (linkedinError) throw linkedinError;
    
    // Get LinkedIn writing samples from documents
    const { data: linkedinDocuments, error: documentsError } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', userId)
      .eq('content_type', 'linkedin')
      .eq('purpose', 'writing_sample')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (documentsError) throw documentsError;
    
    // Combine posts from both sources
    const posts: LinkedinPost[] = [
      ...linkedinPosts.map(post => ({
        id: post.id,
        userId: post.user_id,
        content: post.content,
        publishedAt: post.published_at ? new Date(post.published_at) : undefined,
        url: post.url || '',
        createdAt: new Date(post.created_at)
      })),
      ...linkedinDocuments.map(doc => ({
        id: doc.id,
        userId: doc.user_id,
        content: doc.content || '',
        publishedAt: undefined,
        url: '',
        createdAt: new Date(doc.created_at)
      }))
    ];
    
    // Sort by date (newest first) and limit to requested amount
    return posts
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching LinkedIn posts:', error);
    return [];
  }
}

/**
 * Fetches newsletter writing samples for a user
 */
export async function fetchNewsletterExamples(userId: string, limit: number = 5): Promise<Document[]> {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', userId)
      .eq('content_type', 'newsletter')
      .eq('purpose', 'writing_sample')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    return data.map(doc => ({
      id: doc.id,
      userId: doc.user_id,
      title: doc.title,
      content: doc.content || '',
      type: doc.type,
      purpose: doc.purpose,
      status: doc.status,
      content_type: doc.content_type,
      createdAt: new Date(doc.created_at)
    }));
  } catch (error) {
    console.error('Error fetching newsletter examples:', error);
    return [];
  }
}

/**
 * Fetches marketing writing samples for a user
 */
export async function fetchMarketingExamples(userId: string, limit: number = 5): Promise<Document[]> {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', userId)
      .eq('content_type', 'marketing')
      .eq('purpose', 'writing_sample')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    return data.map(doc => ({
      id: doc.id,
      userId: doc.user_id,
      title: doc.title,
      content: doc.content || '',
      type: doc.type,
      purpose: doc.purpose,
      status: doc.status,
      content_type: doc.content_type,
      createdAt: new Date(doc.created_at)
    }));
  } catch (error) {
    console.error('Error fetching marketing examples:', error);
    return [];
  }
}

/**
 * Fetches relevant business context documents
 */
export async function fetchBusinessContextDocuments(userId: string): Promise<Document[]> {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', userId)
      .eq('purpose', 'business_context')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(doc => ({
      id: doc.id,
      userId: doc.user_id,
      title: doc.title,
      content: doc.content || '',
      type: doc.type,
      purpose: doc.purpose,
      status: doc.status,
      content_type: doc.content_type,
      createdAt: new Date(doc.created_at)
    }));
  } catch (error) {
    console.error('Error fetching business context documents:', error);
    return [];
  }
}
