
import { useState } from 'react';
import { Document } from '@/types';
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';
import { transformToNewsletterExample } from './transformUtils';
import { UseQueryOptions } from '@tanstack/react-query';

/**
 * Get options for fetching all newsletter examples
 */
export const getFetchNewsletterExamplesOptions = (
  options?: Partial<UseQueryOptions<Document[], Error>>
): Partial<UseQueryOptions<Document[], Error>> => {
  const { user } = useAuth();
  
  return {
    queryKey: ['newsletter-examples', user?.id],
    enabled: !!user,
    ...options
  };
};

/**
 * Get options for fetching a single newsletter example
 */
export const getFetchNewsletterExampleByIdOptions = (
  id: string,
  options?: Partial<UseQueryOptions<Document | null, Error>>
): Partial<UseQueryOptions<Document | null, Error>> => {
  const { user } = useAuth();
  
  return {
    queryKey: ['newsletter-example', id, user?.id],
    enabled: !!user && !!id,
    ...options
  };
};

/**
 * Hook for fetching newsletter examples
 */
export const useFetchNewsletterExamples = () => {
  const { user } = useAuth();
  const { createQuery } = useTanstackApiQuery('NewsletterExamplesApi');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Fetch all newsletter examples
   */
  const fetchNewsletterExamples = async (
    options?: Partial<UseQueryOptions<Document[], Error>>
  ): Promise<Document[]> => {
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
          ...getFetchNewsletterExamplesOptions(options)
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
  const fetchNewsletterExampleById = async (
    id: string,
    options?: Partial<UseQueryOptions<Document | null, Error>>
  ): Promise<Document | null> => {
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
          ...getFetchNewsletterExampleByIdOptions(id, options)
        }
      ).refetch();
      
      return result.data;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create base queries to monitor loading state
  const newsletterExamplesQuery = createQuery<Document[]>(
    async () => {
      if (!user?.id) return [];
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
      ...getFetchNewsletterExamplesOptions(),
      initialData: []
    }
  );
  
  return {
    fetchNewsletterExamples,
    fetchNewsletterExampleById,
    isLoading: isLoading || newsletterExamplesQuery.isLoading
  };
};
