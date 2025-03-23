
import { useState } from 'react';
import { CallToAction } from '@/types';
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';
import { processApiResponse } from '@/utils/apiResponseUtils';

/**
 * Hook for fetching call to action data
 */
export const useFetchCallToActions = () => {
  const { user } = useAuth();
  const { createQuery } = useTanstackApiQuery('CallToActionsApi');
  const [selectedCallToAction, setSelectedCallToAction] = useState<CallToAction | null>(null);

  /**
   * Fetch all call to actions
   */
  const fetchCallToActions = async (): Promise<CallToAction[]> => {
    const result = await createQuery<CallToAction[]>(
      async () => {
        if (!user?.id) throw new Error("User not authenticated");
        
        const { data, error } = await supabase
          .from("call_to_actions")
          .select("*")
          .eq("is_archived", false)
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        
        return data.map(cta => {
          const transformedData = processApiResponse(cta);
          
          return {
            id: transformedData.id,
            text: transformedData.text,
            type: transformedData.type,
            description: transformedData.description || "",
            url: transformedData.url || "",
            userId: transformedData.userId,
            isArchived: transformedData.isArchived || false,
            usageCount: transformedData.usageCount || 0,
            createdAt: new Date(transformedData.createdAt)
          } as CallToAction;
        });
      },
      'fetching call to actions',
      {
        queryKey: ['callToActions', user?.id],
        enabled: !!user
      }
    ).refetch();
    
    return result.data || [];
  };
  
  /**
   * Fetch a single call to action by ID
   */
  const fetchCallToActionById = async (id: string): Promise<CallToAction | null> => {
    const result = await createQuery<CallToAction | null>(
      async () => {
        if (!user?.id) throw new Error("User not authenticated");
        if (!id) throw new Error("Call to action ID is required");
        
        const { data, error } = await supabase
          .from("call_to_actions")
          .select("*")
          .eq("id", id)
          .maybeSingle();
          
        if (error) throw error;
        if (!data) return null;
        
        const transformedData = processApiResponse(data);
        
        return {
          id: transformedData.id,
          text: transformedData.text,
          type: transformedData.type,
          description: transformedData.description || "",
          url: transformedData.url || "",
          userId: transformedData.userId,
          isArchived: transformedData.isArchived || false,
          usageCount: transformedData.usageCount || 0,
          createdAt: new Date(transformedData.createdAt)
        } as CallToAction;
      },
      `fetching call to action ${id}`,
      {
        queryKey: ['callToAction', id, user?.id],
        enabled: !!user && !!id
      }
    ).refetch();
    
    return result.data;
  };
  
  // Get the isLoading state from one of the queries (since they share the same state model)
  const { isLoading } = createQuery<CallToAction[]>(
    () => Promise.resolve([]),
    'dummy query for loading state',
    {
      queryKey: ['callToActions', user?.id],
      enabled: false
    }
  );

  return {
    fetchCallToActions,
    fetchCallToActionById,
    selectedCallToAction,
    setSelectedCallToAction,
    isLoading
  };
};
