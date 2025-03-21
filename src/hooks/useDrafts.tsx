
import { useAuth } from "@/context/auth";
import { useDraftsQuery, useDraftByIdQuery } from "@/hooks/draft/useDraftQueries";
import { useDraftMutations } from "@/hooks/draft/useDraftMutations";
import { DraftWithIdea } from "@/services/draftService";

export type { DraftWithIdea };

export const useDrafts = () => {
  const { user } = useAuth();
  const { data: drafts, isLoading, isError } = useDraftsQuery(user?.id);
  const { createDraft, updateDraft, deleteDraft } = useDraftMutations(user?.id);

  return {
    drafts: drafts || [],
    isLoading,
    isError,
    getDraft: (id: string) => useDraftByIdQuery(id, user?.id),
    createDraft,
    updateDraft,
    deleteDraft,
  };
};
