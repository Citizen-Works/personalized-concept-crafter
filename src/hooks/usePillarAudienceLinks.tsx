
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PillarAudienceLink } from "@/types/strategy";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export function usePillarAudienceLinks() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const fetchPillarAudienceLinks = async (): Promise<PillarAudienceLink[]> => {
    if (!user) return [];

    const { data, error } = await supabase
      .from("pillar_audience_links")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching pillar-audience links:", error);
      throw new Error(error.message);
    }

    return data.map(link => ({
      id: link.id,
      pillarId: link.pillar_id,
      audienceId: link.audience_id,
      relationshipStrength: link.relationship_strength,
      userId: link.user_id,
      createdAt: new Date(link.created_at),
    }));
  };

  const pillarAudienceLinksQuery = useQuery({
    queryKey: ["pillarAudienceLinks", user?.id],
    queryFn: fetchPillarAudienceLinks,
    enabled: !!user,
  });

  const createLink = useMutation({
    mutationFn: async (params: { pillarId: string; audienceId: string; relationshipStrength: number }) => {
      if (!user) throw new Error("User not authenticated");
      
      const { pillarId, audienceId, relationshipStrength } = params;
      
      const { data, error } = await supabase
        .from("pillar_audience_links")
        .insert({
          pillar_id: pillarId,
          audience_id: audienceId,
          relationship_strength: relationshipStrength,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pillarAudienceLinks"] });
    },
    onError: (error) => {
      console.error("Error creating pillar-audience link:", error);
      toast.error("Failed to create relationship");
    },
  });

  const updateLink = useMutation({
    mutationFn: async (params: { id: string; relationshipStrength: number }) => {
      const { id, relationshipStrength } = params;
      
      const { error } = await supabase
        .from("pillar_audience_links")
        .update({ relationship_strength: relationshipStrength })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pillarAudienceLinks"] });
    },
    onError: (error) => {
      console.error("Error updating pillar-audience link:", error);
      toast.error("Failed to update relationship");
    },
  });

  const deleteLink = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("pillar_audience_links")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pillarAudienceLinks"] });
    },
    onError: (error) => {
      console.error("Error deleting pillar-audience link:", error);
      toast.error("Failed to delete relationship");
    },
  });

  return {
    pillarAudienceLinks: pillarAudienceLinksQuery.data || [],
    isLoading: pillarAudienceLinksQuery.isLoading,
    isError: pillarAudienceLinksQuery.isError,
    error: pillarAudienceLinksQuery.error,
    refetch: pillarAudienceLinksQuery.refetch,
    createLink,
    updateLink,
    deleteLink,
  };
}
