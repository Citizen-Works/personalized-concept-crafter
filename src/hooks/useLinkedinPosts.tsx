
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LinkedinPost } from '@/types';
import { useAuth } from '@/context/AuthContext';

type PostInput = {
  content: string;
  url: string | null;
};

export const useLinkedinPosts = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all LinkedIn posts
  const fetchPosts = async (): Promise<LinkedinPost[]> => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('linkedin_posts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      userId: item.user_id,
      content: item.content,
      publishedAt: item.published_at ? new Date(item.published_at) : undefined,
      url: item.url || '',
      createdAt: new Date(item.created_at)
    }));
  };

  // Add a new LinkedIn post
  const addNewPost = async (post: PostInput): Promise<LinkedinPost> => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('linkedin_posts')
      .insert([
        {
          content: post.content,
          url: post.url,
          user_id: user.id
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      content: data.content,
      publishedAt: data.published_at ? new Date(data.published_at) : undefined,
      url: data.url || '',
      createdAt: new Date(data.created_at)
    };
  };

  // Delete a LinkedIn post
  const deleteExistingPost = async (id: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('linkedin_posts')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  };

  // Query for LinkedIn posts
  const {
    data: posts,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['linkedin-posts', user?.id],
    queryFn: fetchPosts,
    enabled: !!user
  });

  // Mutation for adding a new post
  const addPostMutation = useMutation({
    mutationFn: addNewPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linkedin-posts', user?.id] });
    }
  });

  // Mutation for deleting a post
  const deletePostMutation = useMutation({
    mutationFn: deleteExistingPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linkedin-posts', user?.id] });
    }
  });

  return {
    posts: posts || [],
    isLoading,
    isError,
    addPost: addPostMutation.mutate,
    deletePost: deletePostMutation.mutate
  };
};
