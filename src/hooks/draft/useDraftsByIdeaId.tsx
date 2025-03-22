
import { useAuth } from "@/context/auth";
import { useQuery } from "@tanstack/react-query";
import { fetchDraftsByIdeaId } from "@/services/draftService";

export const useDraftsByIdeaId = (ideaId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["drafts-by-idea", ideaId],
    queryFn: () => fetchDraftsByIdeaId(ideaId, user?.id || ""),
    enabled: !!user?.id && !!ideaId,
  });
};
