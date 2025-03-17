
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

  return {
    contentPillars: contentPillarsQuery.data || [],
    isLoading: contentPillarsQuery.isLoading,
    isError: contentPillarsQuery.isError,
    error: contentPillarsQuery.error,
    refetch: contentPillarsQuery.refetch,
    deleteContentPillar,
  };
}
