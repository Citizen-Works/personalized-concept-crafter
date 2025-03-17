
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TargetAudience } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export function useTargetAudiences() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const fetchTargetAudiences = async (): Promise<TargetAudience[]> => {
    if (!user) return [];

    const { data, error } = await supabase
      .from("target_audiences")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching target audiences:", error);
      throw new Error(error.message);
    }

    return data.map(audience => ({
      id: audience.id,
      userId: audience.user_id,
      name: audience.name,
      description: audience.description || "",
      painPoints: audience.pain_points || [],
      goals: audience.goals || [],
      createdAt: new Date(audience.created_at),
    }));
  };

  const targetAudiencesQuery = useQuery({
    queryKey: ["targetAudiences", user?.id],
    queryFn: fetchTargetAudiences,
    enabled: !!user,
  });

  const deleteTargetAudience = useMutation({
    mutationFn: async (audienceId: string) => {
      const { error } = await supabase
        .from("target_audiences")
        .delete()
        .eq("id", audienceId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["targetAudiences"] });
      toast.success("Target audience deleted successfully!");
    },
    onError: (error) => {
      console.error("Error deleting target audience:", error);
      toast.error("Failed to delete target audience");
    },
  });

  return {
    targetAudiences: targetAudiencesQuery.data || [],
    isLoading: targetAudiencesQuery.isLoading,
    isError: targetAudiencesQuery.isError,
    error: targetAudiencesQuery.error,
    refetch: targetAudiencesQuery.refetch,
    deleteTargetAudience,
  };
}
