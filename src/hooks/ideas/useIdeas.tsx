
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ContentIdea } from "@/types";
import { useAuth } from "@/context/auth";
import { 
  fetchIdeas, 
  fetchIdeaById, 
  createIdea, 
  updateIdea, 
  deleteIdea 
} from "./ideaApi";
import { IdeaCreateInput, IdeaUpdateInput } from "./types";

export const useIdeas = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const ideasQuery = useQuery({
    queryKey: ["ideas", user?.id],
    queryFn: () => fetchIdeas(user?.id || ""),
    enabled: !!user,
  });

  const ideaByIdQuery = (id: string) => {
    // Only execute the query if id is valid and not "new"
    const enabled = !!user && !!id && id !== "new";
    
    return useQuery({
      queryKey: ["idea", id, user?.id],
      queryFn: () => fetchIdeaById(id, user?.id || ""),
      enabled,
      // Remove the 'useErrorBoundary' option as it's not supported in this version
      retry: false, // Use retry: false instead to avoid multiple failed attempts
    });
  };

  const createIdeaMutation = useMutation({
    mutationFn: (idea: IdeaCreateInput) => createIdea(idea, user?.id || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ideas", user?.id] });
    },
  });

  const updateIdeaMutation = useMutation({
    mutationFn: (params: { id: string } & IdeaUpdateInput) => updateIdea(params, user?.id || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ideas", user?.id] });
    },
  });

  const deleteIdeaMutation = useMutation({
    mutationFn: (id: string) => deleteIdea(id, user?.id || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ideas", user?.id] });
    },
  });

  return {
    ideas: ideasQuery.data || [],
    isLoading: ideasQuery.isLoading,
    isError: ideasQuery.isError,
    getIdea: ideaByIdQuery,
    createIdea: createIdeaMutation.mutate,
    createIdeaAsync: createIdeaMutation.mutateAsync,
    updateIdea: updateIdeaMutation.mutate,
    updateIdeaAsync: updateIdeaMutation.mutateAsync,
    deleteIdea: deleteIdeaMutation.mutate,
  };
};
