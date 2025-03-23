
import { useState } from 'react';
import { Document } from '@/types';
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';
import { transformToMarketingExample } from './transformUtils';

/**
 * Hook for fetching marketing examples
 */
export const useFetchMarketingExamples = () => {
  const { user } = useAuth();
  const { createQuery } = useTanstackApiQuery('MarketingExamplesApi');
  const [selectedExample, setSelectedExample] = useState<Document | null>(null);

  /**
   * Fetch all marketing examples
   */
  const fetchMarketingExamples = async (): Promise<Document[]> => {
    const result = await createQuery<Document[]>(
      async () => {
        if (!user?.id) throw new Error("User not authenticated");
        
        const { data, error } = await supabase
          .from("documents")
          .select("*")
          .eq("user_id", user.id)
          .eq("content_type", "marketing")
          .eq("purpose", "writing_sample")
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        
        return data.map(item => transformToMarketingExample(item));
      },
      'fetching marketing examples',
      {
        queryKey: ['marketing-examples', user?.id],
        enabled: !!user
      }
    ).refetch();
    
    return result.data || [];
  };
  
  /**
   * Fetch a single marketing example by ID
   */
  const fetchMarketingExampleById = async (id: string): Promise<Document | null> => {
    const result = await createQuery<Document | null>(
      async () => {
        if (!user?.id) throw new Error("User not authenticated");
        if (!id) throw new Error("Marketing example ID is required");
        
        const { data, error } = await supabase
          .from("documents")
          .select("*")
          .eq("id", id)
          .eq("user_id", user.id)
          .eq("content_type", "marketing")
          .eq("purpose", "writing_sample")
          .maybeSingle();
          
        if (error) throw error;
        if (!data) return null;
        
        return transformToMarketingExample(data);
      },
      `fetching marketing example ${id}`,
      {
        queryKey: ['marketing-example', id, user?.id],
        enabled: !!user && !!id
      }
    ).refetch();
    
    return result.data;
  };
  
  return {
    fetchMarketingExamples,
    fetchMarketingExampleById,
    selectedExample,
    setSelectedExample
  };
};
