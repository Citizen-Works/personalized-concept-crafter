
import { useQuery } from "@tanstack/react-query";
import { fetchDrafts, fetchDraftById, DraftWithIdea } from "@/services/draftService";

export const useDraftsQuery = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["drafts", userId],
    queryFn: () => fetchDrafts(userId || ""),
    enabled: !!userId,
  });
};

export const useDraftByIdQuery = (id: string, userId: string | undefined) => {
  return useQuery({
    queryKey: ["draft", id, userId],
    queryFn: () => fetchDraftById(id, userId || ""),
    enabled: !!userId && !!id,
  });
};
