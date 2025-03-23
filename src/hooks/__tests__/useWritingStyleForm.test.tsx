
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useWritingStyleForm } from '../useWritingStyleForm';
import { TestWritingStyleProfile } from '@/types/writingStyle';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Mock dependencies
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve())
      })),
      insert: vi.fn(() => Promise.resolve())
    }))
  }
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id' }
  })
}));

// Mock window.location.reload
const mockReload = vi.fn();
Object.defineProperty(window, 'location', {
  value: { reload: mockReload },
  writable: true
});

describe('useWritingStyleForm', () => {
  const mockInitialProfile: TestWritingStyleProfile = {
    id: 'test-profile-id',
    voiceAnalysis: 'Initial voice analysis',
    generalStyleGuide: 'Initial general style',
    vocabularyPatterns: 'Initial vocabulary',
    avoidPatterns: 'Initial avoid patterns',
    linkedinStyleGuide: 'Initial LinkedIn style',
    newsletterStyleGuide: 'Initial newsletter style',
    marketingStyleGuide: 'Initial marketing style',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with empty form state when no initial profile is provided', () => {
    const { result } = renderHook(() => useWritingStyleForm({ user_id: 'test-user-id' }));
    
    expect(result.current.formState).toEqual({
      voiceAnalysis: '',
      generalStyleGuide: '',
      vocabularyPatterns: '',
      avoidPatterns: '',
      linkedinStyleGuide: '',
      newsletterStyleGuide: '',
      marketingStyleGuide: '',
    });
  });

  it('initializes with initial profile data when provided', () => {
    const { result } = renderHook(() => useWritingStyleForm({ 
      ...mockInitialProfile, 
      user_id: 'test-user-id' 
    } as any));
    
    expect(result.current.formState).toEqual({
      voiceAnalysis: 'Initial voice analysis',
      generalStyleGuide: 'Initial general style',
      vocabularyPatterns: 'Initial vocabulary',
      avoidPatterns: 'Initial avoid patterns',
      linkedinStyleGuide: 'Initial LinkedIn style',
      newsletterStyleGuide: 'Initial newsletter style',
      marketingStyleGuide: 'Initial marketing style',
    });
  });

  it('updates form state when handleInputChange is called', () => {
    const { result } = renderHook(() => useWritingStyleForm({ 
      ...mockInitialProfile, 
      user_id: 'test-user-id' 
    } as any));
    
    act(() => {
      result.current.handleInputChange({
        target: { name: 'voiceAnalysis', value: 'Updated voice analysis' }
      } as React.ChangeEvent<HTMLTextAreaElement>);
    });
    
    expect(result.current.formState.voiceAnalysis).toBe('Updated voice analysis');
  });

  it('calls supabase update when saving an existing profile', async () => {
    const updateMock = vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({}) });
    const fromMock = vi.fn().mockReturnValue({ update: updateMock });
    
    // @ts-ignore - we're mocking
    (supabase.from as any) = fromMock;
    
    const { result } = renderHook(() => useWritingStyleForm({ 
      ...mockInitialProfile, 
      user_id: 'test-user-id' 
    } as any));
    
    await act(async () => {
      await result.current.saveWritingStyle();
    });
    
    expect(fromMock).toHaveBeenCalledWith('writing_style_profiles');
    expect(updateMock).toHaveBeenCalledWith({
      voice_analysis: 'Initial voice analysis',
      general_style_guide: 'Initial general style',
      vocabulary_patterns: 'Initial vocabulary',
      avoid_patterns: 'Initial avoid patterns',
      linkedin_style_guide: 'Initial LinkedIn style',
      newsletter_style_guide: 'Initial newsletter style',
      marketing_style_guide: 'Initial marketing style',
    });
    expect(toast.success).toHaveBeenCalledWith('Writing style saved successfully');
    expect(mockReload).toHaveBeenCalled();
  });

  it('calls supabase insert when saving a new profile', async () => {
    const insertMock = vi.fn().mockResolvedValue({});
    const fromMock = vi.fn().mockReturnValue({ insert: insertMock });
    
    // @ts-ignore - we're mocking
    (supabase.from as any) = fromMock;
    
    const { result } = renderHook(() => useWritingStyleForm({ user_id: 'test-user-id' })); // No initial profile
    
    await act(async () => {
      await result.current.saveWritingStyle();
    });
    
    expect(fromMock).toHaveBeenCalledWith('writing_style_profiles');
    expect(insertMock).toHaveBeenCalledWith(expect.objectContaining({
      user_id: 'test-user-id',
      voice_analysis: '',
      general_style_guide: '',
      vocabulary_patterns: '',
      avoid_patterns: '',
      linkedin_style_guide: '',
      newsletter_style_guide: '',
      marketing_style_guide: '',
      example_quotes: [],
      linkedin_examples: [],
      newsletter_examples: [],
      marketing_examples: [],
    }));
    expect(toast.success).toHaveBeenCalledWith('Writing style saved successfully');
    expect(mockReload).toHaveBeenCalled();
  });

  it('shows error toast when saving fails', async () => {
    const error = new Error('Database error');
    const fromMock = vi.fn().mockReturnValue({ 
      update: vi.fn().mockReturnValue({ 
        eq: vi.fn().mockRejectedValue(error) 
      }) 
    });
    
    // @ts-ignore - we're mocking
    (supabase.from as any) = fromMock;
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const { result } = renderHook(() => useWritingStyleForm({ 
      ...mockInitialProfile, 
      user_id: 'test-user-id' 
    } as any));
    
    await act(async () => {
      await result.current.saveWritingStyle();
    });
    
    expect(toast.error).toHaveBeenCalledWith('Failed to save writing style');
    expect(consoleSpy).toHaveBeenCalledWith('Error saving writing style:', error);
    
    consoleSpy.mockRestore();
  });

  it('getPreviewProfile returns a complete profile with both camelCase and snake_case properties', () => {
    const { result } = renderHook(() => useWritingStyleForm({ 
      ...mockInitialProfile, 
      user_id: 'test-user-id' 
    } as any));
    
    const previewProfile = result.current.getPreviewProfile();
    
    // Check camelCase properties
    expect(previewProfile.voiceAnalysis).toBe('Initial voice analysis');
    expect(previewProfile.generalStyleGuide).toBe('Initial general style');
    expect(previewProfile.vocabularyPatterns).toBe('Initial vocabulary');
    expect(previewProfile.avoidPatterns).toBe('Initial avoid patterns');
    expect(previewProfile.linkedinStyleGuide).toBe('Initial LinkedIn style');
    expect(previewProfile.newsletterStyleGuide).toBe('Initial newsletter style');
    expect(previewProfile.marketingStyleGuide).toBe('Initial marketing style');
    
    // Check snake_case properties
    expect(previewProfile.voice_analysis).toBe('Initial voice analysis');
    expect(previewProfile.general_style_guide).toBe('Initial general style');
    expect(previewProfile.vocabulary_patterns).toBe('Initial vocabulary');
    expect(previewProfile.avoid_patterns).toBe('Initial avoid patterns');
    expect(previewProfile.linkedin_style_guide).toBe('Initial LinkedIn style');
    expect(previewProfile.newsletter_style_guide).toBe('Initial newsletter style');
    expect(previewProfile.marketing_style_guide).toBe('Initial marketing style');
    
    // Check other required properties
    expect(previewProfile.id).toBe('test-profile-id');
    expect(previewProfile.user_id).toBe('test-user-id');
    expect(previewProfile.userId).toBe('test-user-id');
    expect(Array.isArray(previewProfile.exampleQuotes)).toBe(true);
    expect(Array.isArray(previewProfile.linkedinExamples)).toBe(true);
    expect(Array.isArray(previewProfile.newsletterExamples)).toBe(true);
    expect(Array.isArray(previewProfile.marketingExamples)).toBe(true);
  });
});
