
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDraft, updateDraft, deleteDraft } from "@/services/draftService";
import { ContentDraft, DraftStatus, ContentType } from "@/types";

export const useDraftMutations = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  const createDraftMutation = useMutation({
    mutationFn: (draft: Omit<ContentDraft, "id" | "createdAt">) => 
      createDraft(draft, userId || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drafts", userId] });
      // When a draft is created, we also need to update the hasBeenUsed field on the idea
      queryClient.invalidateQueries({ queryKey: ["ideas", userId] });
    },
  });

  const updateDraftMutation = useMutation({
    mutationFn: (params: { id: string } & Partial<Omit<ContentDraft, "id" | "createdAt">>) => 
      updateDraft(params, userId || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drafts", userId] });
    },
  });

  const deleteDraftMutation = useMutation({
    mutationFn: (id: string) => deleteDraft(id, userId || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drafts", userId] });
      // Invalidate the drafts for individual ideas as well
      queryClient.invalidateQueries({ queryKey: ["drafts-by-idea"] });
    },
  });

  return {
    createDraft: createDraftMutation.mutate,
    updateDraft: updateDraftMutation.mutate,
    deleteDraft: deleteDraftMutation.mutate,
  };
};
