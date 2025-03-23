
import { Document } from '@/types';
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';
import { TranscriptFilterOptions } from './types';

/**
 * Hook for fetching transcript operations
 */
export const useFetchTranscripts = () => {
  const { user } = useAuth();
  const { createQuery } = useTanstackApiQuery('TranscriptsAPI');
  
  /**
   * Fetch all transcripts for the current user
   */
  const fetchTranscripts = createQuery<Document[], Error>(
    async () => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'transcript')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (!data) return [];
      
      return data.map(doc => ({
        id: doc.id,
        userId: doc.user_id,
        title: doc.title,
        content: doc.content || '',
        type: doc.type,
        purpose: doc.purpose,
        status: doc.status,
        content_type: doc.content_type,
        createdAt: new Date(doc.created_at),
        isEncrypted: doc.is_encrypted || false,
        processing_status: doc.processing_status || 'idle',
        has_ideas: doc.has_ideas || false,
        ideas_count: doc.ideas_count || 0
      }));
    },
    'fetching transcripts',
    {
      queryKey: ['transcripts', user?.id],
      enabled: !!user?.id
    }
  );
  
  /**
   * Fetch a single transcript by ID
   */
  const fetchTranscriptById = createQuery<Document, Error>(
    async (id: string) => {
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
      
      return {
        id: data.id,
        userId: data.user_id,
        title: data.title,
        content: data.content || '',
        type: data.type,
        purpose: data.purpose,
        status: data.status,
        content_type: data.content_type,
        createdAt: new Date(data.created_at),
        isEncrypted: data.is_encrypted || false,
        processing_status: data.processing_status || 'idle',
        has_ideas: data.has_ideas || false,
        ideas_count: data.ideas_count || 0
      };
    },
    'fetching transcript by ID',
    {
      enabled: false // This query won't run automatically
    }
  );
  
  /**
   * Fetch filtered transcripts
   */
  const fetchFilteredTranscripts = createQuery<Document[], Error>(
    async (filters: TranscriptFilterOptions) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      let query = supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'transcript');
      
      // Apply filters if provided
      if (filters.purpose) {
        query = query.eq('purpose', filters.purpose);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (!data) return [];
      
      return data.map(doc => ({
        id: doc.id,
        userId: doc.user_id,
        title: doc.title,
        content: doc.content || '',
        type: doc.type,
        purpose: doc.purpose,
        status: doc.status,
        content_type: doc.content_type,
        createdAt: new Date(doc.created_at),
        isEncrypted: doc.is_encrypted || false,
        processing_status: doc.processing_status || 'idle',
        has_ideas: doc.has_ideas || false,
        ideas_count: doc.ideas_count || 0
      }));
    },
    'fetching filtered transcripts',
    {
      enabled: false // This query won't run automatically
    }
  );
  
  return {
    fetchTranscripts,
    fetchTranscriptById,
    fetchFilteredTranscripts,
    isLoading: fetchTranscripts.isPending
  };
};
