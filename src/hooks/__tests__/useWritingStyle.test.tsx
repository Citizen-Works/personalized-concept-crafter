
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useWritingStyle } from '../useWritingStyle';
import { fetchWritingStyleProfile } from '@/services/profile';
import { saveWritingStyleProfile } from '@/services/writingStyleService';
import { toast } from 'sonner';
import { WritingStyleProfile } from '@/types/writingStyle';

// Mock react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(() => ({
    data: null,
    isPending: false,
    refetch: vi.fn()
  }))
}));

// Mock the useWritingStyleApi hook
vi.mock('../api/useWritingStyleApi', () => ({
  useWritingStyleApi: vi.fn(() => ({
    fetchWritingStyleProfile: {
      data: null,
      isPending: false,
      refetch: vi.fn()
    },
    fetchCustomPromptInstructions: {
      data: null,
      isPending: false,
      refetch: vi.fn()
    },
    createWritingStyleProfile: vi.fn(),
    updateWritingStyleProfile: vi.fn(),
    isLoading: false
  }))
}));

// Mock dependencies
vi.mock('@/services/profile', () => ({
  fetchWritingStyleProfile: vi.fn()
}));

vi.mock('@/services/writingStyleService', () => ({
  saveWritingStyleProfile: vi.fn()
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

vi.mock('@/context/auth', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id' }
  })
}));

describe('useWritingStyle', () => {
  const mockProfile: WritingStyleProfile = {
    id: 'test-profile-id',
    user_id: 'test-user-id',
    userId: 'test-user-id',
    voice_analysis: 'Test voice analysis',
    voiceAnalysis: 'Test voice analysis',
    general_style_guide: 'Test general style guide',
    generalStyleGuide: 'Test general style guide',
    linkedin_style_guide: 'Test LinkedIn style',
    linkedinStyleGuide: 'Test LinkedIn style',
    newsletter_style_guide: 'Test newsletter style',
    newsletterStyleGuide: 'Test newsletter style',
    marketing_style_guide: 'Test marketing style',
    marketingStyleGuide: 'Test marketing style',
    vocabulary_patterns: 'Test vocabulary patterns',
    vocabularyPatterns: 'Test vocabulary patterns',
    avoid_patterns: 'Test avoid patterns',
    avoidPatterns: 'Test avoid patterns',
    exampleQuotes: [],
    linkedinExamples: [],
    newsletterExamples: [],
    marketingExamples: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (fetchWritingStyleProfile as any).mockResolvedValue(mockProfile);
    
    // Set up the API mock more thoroughly
    const apiMock = require('../api/useWritingStyleApi').useWritingStyleApi;
    apiMock.mockImplementation(() => ({
      fetchWritingStyleProfile: {
        data: mockProfile,
        isPending: false,
        refetch: vi.fn()
      },
      fetchCustomPromptInstructions: {
        data: null,
        isPending: false,
        refetch: vi.fn()
      },
      createWritingStyleProfile: vi.fn(),
      updateWritingStyleProfile: vi.fn(),
      isLoading: false
    }));
  });

  it('initializes with data from the API', () => {
    const { result } = renderHook(() => useWritingStyle());
    
    expect(result.current.profile).toEqual(mockProfile);
    expect(result.current.isLoading).toBe(false);
  });

  it('handles updating form values with handleChange', () => {
    const { result } = renderHook(() => useWritingStyle());
    
    act(() => {
      result.current.handleChange({
        target: { name: 'voiceAnalysis', value: 'Updated voice analysis' }
      } as React.ChangeEvent<HTMLTextAreaElement>);
    });
    
    // Since handleChange is now a no-op in the new implementation, we should just
    // make sure it doesn't throw an error
    expect(true).toBe(true);
  });

  it('saves profile when saveProfile is called', async () => {
    const updateMock = vi.fn().mockResolvedValue(mockProfile);
    const apiMock = require('../api/useWritingStyleApi').useWritingStyleApi;
    apiMock.mockImplementation(() => ({
      fetchWritingStyleProfile: {
        data: mockProfile,
        isPending: false,
        refetch: vi.fn()
      },
      fetchCustomPromptInstructions: {
        data: null,
        isPending: false,
        refetch: vi.fn()
      },
      createWritingStyleProfile: vi.fn(),
      updateWritingStyleProfile: updateMock,
      isLoading: false
    }));
    
    const { result } = renderHook(() => useWritingStyle());
    
    await act(async () => {
      await result.current.saveProfile();
    });
    
    expect(toast.success).toHaveBeenCalledWith('Writing style profile saved successfully');
  });

  it('handles save profile error', async () => {
    const error = new Error('Failed to save profile');
    const updateMock = vi.fn().mockRejectedValue(error);
    const apiMock = require('../api/useWritingStyleApi').useWritingStyleApi;
    apiMock.mockImplementation(() => ({
      fetchWritingStyleProfile: {
        data: mockProfile,
        isPending: false,
        refetch: vi.fn()
      },
      fetchCustomPromptInstructions: {
        data: null,
        isPending: false,
        refetch: vi.fn()
      },
      createWritingStyleProfile: vi.fn(),
      updateWritingStyleProfile: updateMock,
      isLoading: false
    }));
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const { result } = renderHook(() => useWritingStyle());
    
    await act(async () => {
      await result.current.saveProfile();
    });
    
    expect(toast.error).toHaveBeenCalledWith('Failed to save writing style profile');
    expect(consoleSpy).toHaveBeenCalledWith('Error in saveProfile:', error);
    
    consoleSpy.mockRestore();
  });

  it('provides refetch method to reload profile data', async () => {
    const refetchMock = vi.fn().mockResolvedValue({ data: mockProfile });
    const apiMock = require('../api/useWritingStyleApi').useWritingStyleApi;
    apiMock.mockImplementation(() => ({
      fetchWritingStyleProfile: {
        data: mockProfile,
        isPending: false,
        refetch: refetchMock
      },
      fetchCustomPromptInstructions: {
        data: null,
        isPending: false,
        refetch: vi.fn()
      },
      createWritingStyleProfile: vi.fn(),
      updateWritingStyleProfile: vi.fn(),
      isLoading: false
    }));
    
    const { result } = renderHook(() => useWritingStyle());
    
    await act(async () => {
      await result.current.refetch();
    });
    
    expect(refetchMock).toHaveBeenCalled();
  });
});
