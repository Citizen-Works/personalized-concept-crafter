
import { supabase } from '@/integrations/supabase/client';
import { LinkedinPost } from '@/types';

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
        createdAt: new Date(post.created_at),
        tag: post.tag || 'My post' // Add tag with default value
      })),
      ...linkedinDocuments.map(doc => ({
        id: doc.id,
        userId: doc.user_id,
        content: doc.content || '',
        publishedAt: undefined,
        url: '',
        createdAt: new Date(doc.created_at),
        tag: 'My post' // Default tag for document-sourced posts
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
