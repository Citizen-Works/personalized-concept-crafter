
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CallToAction } from "@/types/strategy";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export function useCallToActions() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const fetchCallToActions = async (): Promise<CallToAction[]> => {
    if (!user) return [];

    const { data, error } = await supabase
      .from("call_to_actions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching call to actions:", error);
      throw new Error(error.message);
    }

    return data.map(cta => ({
      id: cta.id,
      userId: cta.user_id,
      text: cta.text,
      description: cta.description,
      type: cta.type,
      url: cta.url,
      usageCount: cta.usage_count || 0,
      isArchived: cta.is_archived || false,
      createdAt: new Date(cta.created_at),
      updatedAt: new Date(cta.updated_at),
    }));
  };

  const callToActionsQuery = useQuery({
    queryKey: ["callToActions", user?.id],
    queryFn: fetchCallToActions,
    enabled: !!user,
  });

  const deleteCallToAction = useMutation({
    mutationFn: async (ctaId: string) => {
      const { error } = await supabase
        .from("call_to_actions")
        .delete()
        .eq("id", ctaId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callToActions"] });
      toast.success("Call to action deleted successfully!");
    },
    onError: (error) => {
      console.error("Error deleting call to action:", error);
      toast.error("Failed to delete call to action");
    },
  });

  const updateCallToAction = useMutation({
    mutationFn: async (params: { id: string; [key: string]: any }) => {
      const { id, ...updates } = params;
      
      const { error } = await supabase
        .from("call_to_actions")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callToActions"] });
      toast.success("Call to action updated successfully!");
    },
    onError: (error) => {
      console.error("Error updating call to action:", error);
      toast.error("Failed to update call to action");
    },
  });

  return {
    callToActions: callToActionsQuery.data || [],
    isLoading: callToActionsQuery.isLoading,
    isError: callToActionsQuery.isError,
    error: callToActionsQuery.error,
    refetch: callToActionsQuery.refetch,
    deleteCallToAction,
    updateCallToAction,
  };
}
