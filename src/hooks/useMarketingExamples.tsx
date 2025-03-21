import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Document } from '@/types';
import { useAuth } from '@/context/auth';

type ExampleInput = {
  title: string;
  content: string;
};

type MarketingExample = {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: Date;
};

export const useMarketingExamples = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all marketing examples (using documents table with content_type = 'marketing')
  const fetchExamples = async (): Promise<MarketingExample[]> => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', user.id)
      .eq('content_type', 'marketing')
      .eq('purpose', 'writing_sample')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      userId: item.user_id,
      title: item.title,
      content: item.content || '',
      createdAt: new Date(item.created_at)
    }));
  };

  // Add a new marketing example
  const addNewExample = async (example: ExampleInput): Promise<MarketingExample> => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('documents')
      .insert([
        {
          title: example.title,
          content: example.content,
          type: 'other', // Ensure this matches Document type constraints
          purpose: 'writing_sample',
          status: 'active',
          content_type: 'marketing',
          user_id: user.id
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      content: data.content || '',
      createdAt: new Date(data.created_at)
    };
  };

  // Delete a marketing example
  const deleteExistingExample = async (id: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  };

  // Query for marketing examples
  const {
    data: examples,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['marketing-examples', user?.id],
    queryFn: fetchExamples,
    enabled: !!user
  });

  // Mutation for adding a new example
  const addExampleMutation = useMutation({
    mutationFn: addNewExample,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing-examples', user?.id] });
    }
  });

  // Mutation for deleting an example
  const deleteExampleMutation = useMutation({
    mutationFn: deleteExistingExample,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing-examples', user?.id] });
    }
  });

  return {
    examples: examples || [],
    isLoading,
    isError,
    addExample: addExampleMutation.mutate,
    deleteExample: deleteExampleMutation.mutate
  };
};
