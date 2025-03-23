
import { Document } from '@/types';
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';
import { transformToDocument } from './transformUtils';

/**
 * Hook for fetching documents data
 */
export const useFetchDocuments = () => {
  const { user } = useAuth();
  const { createQuery } = useTanstackApiQuery('DocumentsApi');

  const fetchDocuments = (options = {}) => {
    return createQuery<Document[]>(
      async () => {
        if (!user?.id) throw new Error("User not authenticated");
        
        const { data, error } = await supabase
          .from("documents")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        
        return data.map(item => transformToDocument(item));
      },
      'fetching documents',
      {
        ...options,
        queryKey: ['documents', user?.id],
        enabled: !!user
      }
    );
  };
  
  const fetchDocumentById = (id: string, options = {}) => {
    return createQuery<Document | null>(
      async () => {
        if (!user?.id) throw new Error("User not authenticated");
        if (!id) throw new Error("Document ID is required");
        
        const { data, error } = await supabase
          .from("documents")
          .select("*")
          .eq("id", id)
          .eq("user_id", user.id)
          .maybeSingle();
          
        if (error) throw error;
        if (!data) return null;
        
        return transformToDocument(data);
      },
      `fetching document ${id}`,
      {
        ...options,
        queryKey: ['document', id, user?.id],
        enabled: !!user && !!id
      }
    );
  };

  return {
    fetchDocuments,
    fetchDocumentById
  };
};
