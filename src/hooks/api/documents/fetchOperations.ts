
import { Document } from '@/types';
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';
import { transformToDocument } from './transformUtils';
import { useMemo, useState } from 'react';

/**
 * Hook for fetching documents with various operations
 */
export const useFetchDocuments = () => {
  const { user } = useAuth();
  const { createQuery } = useTanstackApiQuery('DocumentsApi');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  /**
   * Fetch all documents
   */
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

  /**
   * Fetch a single document by ID
   */
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

  /**
   * Fetch documents by type
   */
  const fetchDocumentsByType = (type: string, options = {}) => {
    return createQuery<Document[]>(
      async () => {
        if (!user?.id) throw new Error("User not authenticated");
        if (!type) throw new Error("Document type is required");
        
        const { data, error } = await supabase
          .from("documents")
          .select("*")
          .eq("user_id", user.id)
          .eq("type", type)
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        
        return data.map(item => transformToDocument(item));
      },
      `fetching documents by type ${type}`,
      {
        ...options,
        queryKey: ['documents', 'type', type, user?.id],
        enabled: !!user && !!type
      }
    );
  };

  return useMemo(() => ({
    fetchDocuments,
    fetchDocumentById,
    fetchDocumentsByType,
    selectedDocument,
    setSelectedDocument
  }), [selectedDocument, user?.id]);
};
