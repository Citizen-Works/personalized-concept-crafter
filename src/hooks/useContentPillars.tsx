
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ContentPillar } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export function useContentPillars() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const fetchContentPillars = async (): Promise<ContentPillar[]> => {
    if (!user) return [];

    const { data, error } = await supabase
      .from("content_pillars")
      .select("*")
      .eq("user_id", user.id)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching content pillars:", error);
      throw new Error(error.message);
    }

    return data.map(pillar => ({
      id: pillar.id,
      userId: pillar.user_id,
      name: pillar.name,
      description: pillar.description || "",
      createdAt: new Date(pillar.created_at),
      displayOrder: pillar.display_order || 0,
      isArchived: pillar.is_archived || false,
      usageCount: pillar.usage_count || 0,
    }));
  };

  const contentPillarsQuery = useQuery({
    queryKey: ["contentPillars", user?.id],
    queryFn: fetchContentPillars,
    enabled: !!user,
  });

  const deleteContentPillar = useMutation({
    mutationFn: async (pillarId: string) => {
      const { error } = await supabase
        .from("content_pillars")
        .delete()
        .eq("id", pillarId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contentPillars"] });
      toast.success("Content pillar deleted successfully!");
    },
    onError: (error) => {
      console.error("Error deleting content pillar:", error);
      toast.error("Failed to delete content pillar");
    },
  });

  const updateContentPillar = useMutation({
    mutationFn: async (params: { id: string; [key: string]: any }) => {
      const { id, ...updates } = params;
      
      const { error } = await supabase
        .from("content_pillars")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contentPillars"] });
      toast.success("Content pillar updated successfully!");
    },
    onError: (error) => {
      console.error("Error updating content pillar:", error);
      toast.error("Failed to update content pillar");
    },
  });

  const updatePillarOrder = useMutation({
    mutationFn: async (pillarOrders: { id: string; displayOrder: number }[]) => {
      if (!user) return;
      
      // First, fetch the current pillars to get all the required fields
      const { data: currentPillars, error: fetchError } = await supabase
        .from("content_pillars")
        .select("id, name, user_id")
        .in("id", pillarOrders.map(p => p.id));
        
      if (fetchError) throw fetchError;
      
      // Create a map of the current pillars for quick lookup
      const pillarMap = new Map(currentPillars.map(p => [p.id, p]));
      
      // Create a complete update object for each pillar
      const updates = pillarOrders.map(({ id, displayOrder }) => ({
        id,
        display_order: displayOrder,
        name: pillarMap.get(id)?.name || "", // Required field
        user_id: user.id, // Required field
      }));
      
      const { error } = await supabase
        .from("content_pillars")
        .upsert(updates);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contentPillars"] });
      toast.success("Pillar order updated successfully!");
    },
    onError: (error) => {
      console.error("Error updating pillar order:", error);
      toast.error("Failed to update pillar order");
    },
  });

  return {
    contentPillars: contentPillarsQuery.data || [],
    isLoading: contentPillarsQuery.isLoading,
    isError: contentPillarsQuery.isError,
    error: contentPillarsQuery.error,
    refetch: contentPillarsQuery.refetch,
    deleteContentPillar,
    updateContentPillar,
    updatePillarOrder,
  };
}
