
import { useQuery } from "@tanstack/react-query";
import { fetchDraftsByIdeaId } from "@/services/draftService";
import { useAuth } from "@/context/AuthContext";

export const useDraftsByIdeaId = (ideaId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["drafts", "idea", ideaId, user?.id],
    queryFn: () => fetchDraftsByIdeaId(ideaId, user?.id || ""),
    enabled: !!user && !!ideaId,
  });
};
