
import { useQuery } from "@tanstack/react-query";
import { fetchDraftsByIdeaId } from "@/services/draftService";
import { useAuth } from "@/context/auth";
import { useErrorHandling } from "@/hooks/useErrorHandling";

/**
 * Hook to fetch drafts by idea ID with improved error handling and multi-tenant awareness
 */
export const useDraftsByIdeaId = (ideaId: string) => {
  const { user } = useAuth();
  const { handleError } = useErrorHandling('DraftsByIdeaId');
  
  // Extract tenant ID from user email domain (simple approach)
  const tenantId = user?.email ? user.email.split('@')[1] : undefined;
  
  return useQuery({
    queryKey: ["drafts", "idea", ideaId, user?.id, tenantId],
    queryFn: async () => {
      try {
        return await fetchDraftsByIdeaId(ideaId, user?.id || "");
      } catch (error) {
        // Use our consistent error handling
        handleError(error, `fetching drafts for idea ${ideaId}`);
        throw error;
      }
    },
    enabled: !!user?.id && !!ideaId,
    // Better handling for stale data in multi-tenant contexts
    staleTime: 60 * 1000, // 1 minute
    // Improved retry logic for network issues
    retry: (failureCount, error) => {
      // Only retry network errors, not authorization or validation errors
      const status = (error as any)?.status;
      if (status === 401 || status === 403 || status === 400) return false;
      return failureCount < 3;
    }
  });
};
