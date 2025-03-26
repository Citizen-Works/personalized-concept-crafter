import { Document, DocumentType, DocumentPurpose, DocumentStatus, DocumentContentType } from '@/types';
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';
import { TranscriptFilterOptions } from './types';

/**
 * Transform database record to Document type
 */
const transformToDocument = (doc: any): Document => {
  return {
    id: doc.id,
    userId: doc.user_id,
    title: doc.title,
    content: doc.content || '',
    type: doc.type as DocumentType, // Type assertion to ensure compatibility
    purpose: doc.purpose as DocumentPurpose,
    status: doc.status as DocumentStatus,
    content_type: doc.content_type as DocumentContentType,
    createdAt: new Date(doc.created_at),
    isEncrypted: doc.is_encrypted || false,
    processing_status: doc.processing_status || 'idle',
    has_ideas: doc.has_ideas || false,
    ideas_count: doc.ideas_count || 0
  };
};

/**
 * Hook for fetching transcript operations
 */
export const useFetchTranscripts = () => {
  const { user } = useAuth();
  const { createQuery } = useTanstackApiQuery('TranscriptsAPI');
  
  /**
   * Fetch all transcripts for the current user
   */
  const fetchTranscripts = createQuery<Document[]>(
    async () => {
      if (!user?.id) throw new Error("User not authenticated");
      
      console.log('Fetching transcripts for user:', user.id);
      
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'transcript')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Supabase fetch error:', error);
        throw error;
      }
      
      console.log('Received transcripts from Supabase:', data);
      
      if (!data) return [];
      
      const transformed = data.map(doc => transformToDocument(doc));
      console.log('Transformed transcripts:', transformed);
      
      return transformed;
    },
    'fetching transcripts',
    {
      queryKey: ['transcripts', user?.id],
      enabled: !!user?.id,
      staleTime: 1000 * 30, // Consider data stale after 30 seconds
      gcTime: 1000 * 60 * 5, // Cache for 5 minutes
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      retry: 3,
      retryDelay: 1000
    }
  );
  
  /**
   * Fetch a single transcript by ID
   */
  const fetchTranscriptById = (id?: string) => createQuery<Document>(
    async () => {
      if (!user?.id) throw new Error("User not authenticated");
      if (!id) throw new Error("Transcript ID is required");
      
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .eq('type', 'transcript')
        .single();
      
      if (error) throw error;
      
      return transformToDocument(data);
    },
    `fetching transcript ${id}`,
    {
      queryKey: ['transcript', id, user?.id],
      enabled: !!user?.id && !!id
    }
  );
  
  /**
   * Fetch filtered transcripts
   */
  const fetchFilteredTranscripts = (filters?: TranscriptFilterOptions) => createQuery<Document[]>(
    async () => {
      if (!user?.id) throw new Error("User not authenticated");
      
      let query = supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'transcript');
      
      // Apply filters if provided
      if (filters?.purpose) {
        query = query.eq('purpose', filters.purpose);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (!data) return [];
      
      return data.map(doc => transformToDocument(doc));
    },
    'fetching filtered transcripts',
    {
      queryKey: ['transcripts', 'filtered', user?.id, filters],
      enabled: !!user?.id
    }
  );
  
  return {
    fetchTranscripts,
    fetchTranscriptById,
    fetchFilteredTranscripts,
    isLoading: fetchTranscripts.isPending
  };
};
