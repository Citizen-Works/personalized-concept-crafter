import { renderHook, act } from '@testing-library/react';
import { useWritingStyle } from '../useWritingStyle';
import { fetchWritingStyleProfile } from '@/services/profile';
import { saveWritingStyleProfile } from '@/services/writingStyleService';
import { toast } from 'sonner';
import { WritingStyleProfile } from '@/types/writingStyle';

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

vi.mock('@/context/AuthContext', () => ({
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
    (fetchWritingStyleProfile as jest.Mock).mockResolvedValue(mockProfile);
  });

  it('initializes with default empty profile', () => {
    const { result } = renderHook(() => useWritingStyle());
    
    expect(result.current.profile.user_id).toBe('test-user-id');
    expect(result.current.profile.voice_analysis).toBe('');
    expect(result.current.profile.general_style_guide).toBe('');
    // ... other default values
  });

  it('loads profile data on initialization', async () => {
    const { result, rerender } = renderHook(() => useWritingStyle());
    
    // Initial loading state
    expect(result.current.isLoading).toBe(true);
    
    // Wait for the profile to load
    await act(async () => {
      await Promise.resolve();
    });
    
    rerender();
    
    // Check that fetchWritingStyleProfile was called
    expect(fetchWritingStyleProfile).toHaveBeenCalledWith('test-user-id');
    
    // Check that the profile was loaded
    expect(result.current.profile).toEqual(mockProfile);
    expect(result.current.isLoading).toBe(false);
  });

  it('handles profile loading error', async () => {
    const error = new Error('Failed to load profile');
    (fetchWritingStyleProfile as jest.Mock).mockRejectedValue(error);
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    renderHook(() => useWritingStyle());
    
    await act(async () => {
      await Promise.resolve();
    });
    
    expect(toast.error).toHaveBeenCalledWith('Failed to load writing style profile');
    expect(consoleSpy).toHaveBeenCalledWith('Error in loadProfile:', error);
    
    consoleSpy.mockRestore();
  });

  it('updates form values when handleChange is called', () => {
    const { result } = renderHook(() => useWritingStyle());
    
    act(() => {
      result.current.handleChange({
        target: { name: 'voiceAnalysis', value: 'Updated voice analysis' }
      } as React.ChangeEvent<HTMLTextAreaElement>);
    });
    
    expect(result.current.profile.voiceAnalysis).toBe('Updated voice analysis');
  });

  it('saves profile when saveProfile is called', async () => {
    const { result } = renderHook(() => useWritingStyle());
    
    await act(async () => {
      await result.current.saveProfile();
    });
    
    expect(saveWritingStyleProfile).toHaveBeenCalledWith(result.current.profile);
    expect(toast.success).toHaveBeenCalledWith('Writing style profile saved successfully');
  });

  it('handles save profile error', async () => {
    const error = new Error('Failed to save profile');
    (saveWritingStyleProfile as jest.Mock).mockRejectedValue(error);
    
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
    const { result } = renderHook(() => useWritingStyle());
    
    // Clear the first call to fetchWritingStyleProfile from initialization
    (fetchWritingStyleProfile as jest.Mock).mockClear();
    
    await act(async () => {
      await result.current.refetch();
    });
    
    expect(fetchWritingStyleProfile).toHaveBeenCalledWith('test-user-id');
  });
});
