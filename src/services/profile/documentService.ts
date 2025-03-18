
import { supabase } from '@/integrations/supabase/client';
import { Document } from '@/types';

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
      type: doc.type as "blog" | "newsletter" | "whitepaper" | "case-study" | "other",
      purpose: doc.purpose as "writing_sample" | "business_context",
      status: doc.status as "active" | "archived",
      content_type: doc.content_type as "linkedin" | "newsletter" | "marketing" | "general" | null,
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
      type: doc.type as "blog" | "newsletter" | "whitepaper" | "case-study" | "other",
      purpose: doc.purpose as "writing_sample" | "business_context",
      status: doc.status as "active" | "archived",
      content_type: doc.content_type as "linkedin" | "newsletter" | "marketing" | "general" | null,
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
      type: doc.type as "blog" | "newsletter" | "whitepaper" | "case-study" | "other",
      purpose: doc.purpose as "writing_sample" | "business_context",
      status: doc.status as "active" | "archived",
      content_type: doc.content_type as "linkedin" | "newsletter" | "marketing" | "general" | null,
      createdAt: new Date(doc.created_at)
    }));
  } catch (error) {
    console.error('Error fetching business context documents:', error);
    return [];
  }
}
