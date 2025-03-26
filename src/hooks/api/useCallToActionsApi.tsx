import { useAuth } from '../../context/auth';
import { supabase } from '../../integrations/supabase/client';
import { CallToAction } from '../../types/strategy';
import { CallToActionCreateInput, CallToActionUpdateInput } from './call-to-actions/types';

const transformToCallToAction = (data: any): CallToAction => ({
  id: data.id,
  userId: data.user_id,
  text: data.text,
  description: data.description,
  type: data.type,
  url: data.url,
  usageCount: data.usage_count || 0,
  isArchived: data.is_archived || false,
  createdAt: new Date(data.created_at),
  updatedAt: new Date(data.updated_at)
});

export const useCallToActionsApi = () => {
  const { user } = useAuth();

  return {
    fetchCallToActions: async (): Promise<CallToAction[]> => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('call_to_actions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching call to actions:', error);
        throw error;
      }

      return data.map(transformToCallToAction);
    },

    fetchCallToActionById: async (id: string): Promise<CallToAction> => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('call_to_actions')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching call to action:', error);
        throw error;
      }

      return transformToCallToAction(data);
    },

    createCallToAction: async (input: CallToActionCreateInput): Promise<CallToAction> => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('call_to_actions')
        .insert([{
          text: input.text,
          description: input.description,
          type: input.type,
          url: input.url,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          usage_count: 0,
          is_archived: false
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating call to action:', error);
        throw error;
      }

      return transformToCallToAction(data);
    },

    updateCallToAction: async (id: string, updates: CallToActionUpdateInput): Promise<CallToAction> => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('call_to_actions')
        .update({
          text: updates.text,
          description: updates.description,
          type: updates.type,
          url: updates.url,
          is_archived: updates.isArchived,
          usage_count: updates.usageCount,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating call to action:', error);
        throw error;
      }

      return transformToCallToAction(data);
    },

    archiveCallToAction: async (id: string): Promise<void> => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from('call_to_actions')
        .update({
          is_archived: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error archiving call to action:', error);
        throw error;
      }
    },

    incrementUsageCount: async (id: string): Promise<void> => {
      if (!user?.id) throw new Error("User not authenticated");
      
      // First get the current usage count
      const { data: currentData, error: fetchError } = await supabase
        .from('call_to_actions')
        .select('usage_count')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        console.error('Error fetching current usage count:', fetchError);
        throw fetchError;
      }

      const { error: updateError } = await supabase
        .from('call_to_actions')
        .update({
          usage_count: (currentData.usage_count || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error incrementing usage count:', updateError);
        throw updateError;
      }
    }
  };
}; 