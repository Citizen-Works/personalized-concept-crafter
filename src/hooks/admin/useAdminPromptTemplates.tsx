
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchPromptTemplates,
  fetchPromptTemplate,
  updatePromptTemplate,
  createPromptTemplate,
  createVersionedPromptTemplate,
  fetchTemplateVersionHistory,
  activatePromptTemplateVersion,
  PromptTemplate
} from '@/services/admin/promptTemplateService';

export function useAdminPromptTemplates() {
  const queryClient = useQueryClient();
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);

  // Fetch all prompt templates
  const { 
    data: promptTemplates, 
    isLoading: isLoadingTemplates,
    isError: isTemplatesError,
    error: templatesError,
    refetch: refetchTemplates
  } = useQuery({
    queryKey: ['promptTemplates'],
    queryFn: fetchPromptTemplates
  });

  // Fetch a specific template when selected
  const { 
    data: templateData,
    isLoading: isTemplateLoading,
    isError: isTemplateError,
    error: templateError,
    refetch: refetchTemplate
  } = useQuery({
    queryKey: ['promptTemplate', selectedTemplate?.template_key],
    queryFn: () => selectedTemplate?.template_key ? fetchPromptTemplate(selectedTemplate.template_key) : null,
    enabled: !!selectedTemplate?.template_key
  });

  // Fetch template version history
  const { 
    data: templateHistory,
    isLoading: isHistoryLoading,
    refetch: refetchHistory
  } = useQuery({
    queryKey: ['templateHistory', selectedTemplate?.template_key],
    queryFn: () => selectedTemplate?.template_key ? fetchTemplateVersionHistory(selectedTemplate.template_key) : [],
    enabled: !!selectedTemplate?.template_key
  });

  // Update prompt template
  const updateMutation = useMutation({
    mutationFn: updatePromptTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promptTemplates'] });
      queryClient.invalidateQueries({ queryKey: ['promptTemplate', selectedTemplate?.template_key] });
    }
  });

  // Create new prompt template
  const createMutation = useMutation({
    mutationFn: createPromptTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promptTemplates'] });
    }
  });

  // Create a new version of an existing template
  const versionMutation = useMutation({
    mutationFn: ({ originalId, updatedContent }: { originalId: string, updatedContent: Partial<PromptTemplate> }) => 
      createVersionedPromptTemplate(originalId, updatedContent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promptTemplates'] });
      queryClient.invalidateQueries({ queryKey: ['promptTemplate', selectedTemplate?.template_key] });
      queryClient.invalidateQueries({ queryKey: ['templateHistory', selectedTemplate?.template_key] });
    }
  });

  // Activate a specific version of a template
  const activateMutation = useMutation({
    mutationFn: activatePromptTemplateVersion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promptTemplates'] });
      queryClient.invalidateQueries({ queryKey: ['promptTemplate', selectedTemplate?.template_key] });
      queryClient.invalidateQueries({ queryKey: ['templateHistory', selectedTemplate?.template_key] });
    }
  });

  return {
    promptTemplates,
    isLoadingTemplates,
    isTemplatesError,
    templatesError,
    refetchTemplates,
    
    selectedTemplate,
    setSelectedTemplate,
    templateData,
    isTemplateLoading,
    isTemplateError,
    templateError,
    refetchTemplate,
    
    templateHistory,
    isHistoryLoading,
    refetchHistory,
    
    updateTemplate: updateMutation.mutate,
    isUpdatingTemplate: updateMutation.isPending,
    updateError: updateMutation.error,
    
    createTemplate: createMutation.mutate,
    isCreatingTemplate: createMutation.isPending,
    createError: createMutation.error,
    
    createVersionedTemplate: versionMutation.mutate,
    isVersioning: versionMutation.isPending,
    versionError: versionMutation.error,
    
    activateTemplateVersion: activateMutation.mutate,
    isActivating: activateMutation.isPending,
    activateError: activateMutation.error
  };
}
