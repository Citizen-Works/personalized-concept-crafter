
import { useState } from 'react';
import { Document } from '@/types';
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';
import { transformToNewsletterExample } from './transformUtils';

/**
 * Hook for fetching newsletter examples
 */
export const useFetchNewsletterExamples = () => {
  const { user } = useAuth();
  const { createQuery } = useTanstackApiQuery('NewsletterExamplesApi');
  const [selectedExample, setSelectedExample] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Fetch all newsletter examples
   */
  const fetchNewsletterExamples = async (): Promise<Document[]> => {
    setIsLoading(true);
    try {
      const result = await createQuery<Document[]>(
        async () => {
          if (!user?.id) throw new Error("User not authenticated");
          
          const { data, error } = await supabase
            .from("documents")
            .select("*")
            .eq("user_id", user.id)
            .eq("content_type", "newsletter")
            .eq("purpose", "writing_sample")
            .order("created_at", { ascending: false });
            
          if (error) throw error;
          
          return data.map(item => transformToNewsletterExample(item));
        },
        'fetching newsletter examples',
        {
          queryKey: ['newsletter-examples', user?.id],
          enabled: !!user
        }
      ).refetch();
      
      return result.data || [];
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Fetch a single newsletter example by ID
   */
  const fetchNewsletterExampleById = async (id: string): Promise<Document | null> => {
    setIsLoading(true);
    try {
      const result = await createQuery<Document | null>(
        async () => {
          if (!user?.id) throw new Error("User not authenticated");
          if (!id) throw new Error("Newsletter example ID is required");
          
          const { data, error } = await supabase
            .from("documents")
            .select("*")
            .eq("id", id)
            .eq("user_id", user.id)
            .eq("content_type", "newsletter")
            .eq("purpose", "writing_sample")
            .maybeSingle();
            
          if (error) throw error;
          if (!data) return null;
          
          return transformToNewsletterExample(data);
        },
        `fetching newsletter example ${id}`,
        {
          queryKey: ['newsletter-example', id, user?.id],
          enabled: !!user && !!id
        }
      ).refetch();
      
      return result.data;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    fetchNewsletterExamples,
    fetchNewsletterExampleById,
    selectedExample,
    setSelectedExample,
    isLoading
  };
};
