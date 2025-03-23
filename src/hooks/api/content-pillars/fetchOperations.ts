
import { useState } from 'react';
import { ContentPillar } from '@/types';
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';
import { transformToContentPillar } from './transformUtils';

/**
 * Hook for fetching content pillar data
 */
export const useFetchContentPillars = () => {
  const { user } = useAuth();
  const { createQuery } = useTanstackApiQuery('ContentPillarsApi');
  const [selectedPillar, setSelectedPillar] = useState<ContentPillar | null>(null);

  /**
   * Fetch all content pillars
   */
  const fetchContentPillars = async (): Promise<ContentPillar[]> => {
    const result = await createQuery<ContentPillar[]>(
      async () => {
        if (!user?.id) throw new Error("User not authenticated");
        
        const { data, error } = await supabase
          .from("content_pillars")
          .select("*")
          .eq("user_id", user.id)
          .order("display_order", { ascending: true })
          .order("name", { ascending: true });
          
        if (error) throw error;
        
        return data.map(transformToContentPillar);
      },
      'fetching content pillars',
      {
        queryKey: ['contentPillars', user?.id],
        enabled: !!user
      }
    ).refetch();
    
    return result.data || [];
  };
  
  /**
   * Fetch a single content pillar by ID
   */
  const fetchContentPillarById = async (id: string): Promise<ContentPillar | null> => {
    const result = await createQuery<ContentPillar | null>(
      async () => {
        if (!user?.id) throw new Error("User not authenticated");
        if (!id) throw new Error("Content pillar ID is required");
        
        const { data, error } = await supabase
          .from("content_pillars")
          .select("*")
          .eq("id", id)
          .eq("user_id", user.id)
          .maybeSingle();
          
        if (error) throw error;
        if (!data) return null;
        
        return transformToContentPillar(data);
      },
      `fetching content pillar ${id}`,
      {
        queryKey: ['contentPillar', id, user?.id],
        enabled: !!user && !!id
      }
    ).refetch();
    
    return result.data;
  };
  
  // Get the isLoading state from one of the queries (since they share the same state model)
  const { isLoading } = createQuery<ContentPillar[]>(
    () => Promise.resolve([]),
    'dummy query for loading state',
    {
      queryKey: ['contentPillars', user?.id],
      enabled: false
    }
  );

  return {
    fetchContentPillars,
    fetchContentPillarById,
    selectedPillar,
    setSelectedPillar,
    isLoading
  };
};
