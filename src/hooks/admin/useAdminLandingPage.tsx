
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchLandingPageContent,
  fetchLandingPageSection,
  updateLandingPageContent,
  createLandingPageContent,
  LandingPageContent
} from '@/services/admin/landingPageService';

export function useAdminLandingPage() {
  const queryClient = useQueryClient();
  const [selectedSection, setSelectedSection] = useState<LandingPageContent | null>(null);

  // Fetch all landing page content
  const { 
    data: landingPageSections, 
    isLoading: isLoadingSections,
    isError: isSectionsError,
    error: sectionsError,
    refetch: refetchSections
  } = useQuery({
    queryKey: ['landingPageContent'],
    queryFn: fetchLandingPageContent
  });

  // Fetch a specific section when selected
  const { 
    data: sectionData,
    isLoading: isSectionLoading,
    isError: isSectionError,
    error: sectionError
  } = useQuery({
    queryKey: ['landingPageSection', selectedSection?.section_key],
    queryFn: () => selectedSection?.section_key ? fetchLandingPageSection(selectedSection.section_key) : null,
    enabled: !!selectedSection?.section_key
  });

  // Update landing page content
  const updateMutation = useMutation({
    mutationFn: updateLandingPageContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landingPageContent'] });
      queryClient.invalidateQueries({ queryKey: ['landingPageSection', selectedSection?.section_key] });
    }
  });

  // Create new landing page section
  const createMutation = useMutation({
    mutationFn: createLandingPageContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landingPageContent'] });
    }
  });

  return {
    landingPageSections,
    isLoadingSections,
    isSectionsError,
    sectionsError,
    refetchSections,
    
    selectedSection,
    setSelectedSection,
    sectionData,
    isSectionLoading,
    isSectionError,
    sectionError,
    
    updateSection: updateMutation.mutate,
    isUpdatingSections: updateMutation.isPending,
    updateError: updateMutation.error,
    
    createSection: createMutation.mutate,
    isCreatingSection: createMutation.isPending,
    createError: createMutation.error
  };
}
