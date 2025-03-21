
import { useAuth } from "@/context/auth";
import { useDraftsQuery, useDraftByIdQuery } from "@/hooks/draft/useDraftQueries";
import { useDraftMutations } from "@/hooks/draft/useDraftMutations";
import { DraftWithIdea } from "@/services/draftService";
import { useState, useEffect } from "react";

export type { DraftWithIdea };

export const useDrafts = () => {
  const { user } = useAuth();
  const { data: drafts, isLoading, isError, refetch } = useDraftsQuery(user?.id);
  const { createDraft, updateDraft, deleteDraft } = useDraftMutations(user?.id);
  const [isInitialized, setIsInitialized] = useState(false);

  // Ensure that drafts are properly fetched after user is authenticated
  useEffect(() => {
    if (user?.id && !isInitialized) {
      refetch();
      setIsInitialized(true);
    }
  }, [user?.id, refetch, isInitialized]);

  return {
    drafts: drafts || [],
    isLoading,
    isError,
    getDraft: (id: string) => useDraftByIdQuery(id, user?.id),
    createDraft,
    updateDraft,
    deleteDraft,
    refetch,
  };
};
