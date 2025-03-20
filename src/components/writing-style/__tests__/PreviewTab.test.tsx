
import { render } from '@testing-library/react';
import { PreviewTab } from '../PreviewTab';
import { WritingStyleProfile } from '@/types/writingStyle';
import { vi } from 'vitest';

// Mock the WritingStylePreview component since we're testing it separately
vi.mock('../WritingStylePreview', () => ({
  WritingStylePreview: ({ writingStyle }: { writingStyle: Partial<WritingStyleProfile> }) => (
    <div data-testid="writing-style-preview" data-writing-style={JSON.stringify(writingStyle)}>
      Preview Component
    </div>
  ),
}));

describe('PreviewTab', () => {
  const mockWritingStyle: Partial<WritingStyleProfile> = {
    voiceAnalysis: 'Test voice',
    generalStyleGuide: 'Test style',
    vocabularyPatterns: 'Test vocabulary',
    avoidPatterns: 'Test avoid',
    linkedinStyleGuide: 'Test LinkedIn',
    newsletterStyleGuide: 'Test newsletter',
    marketingStyleGuide: 'Test marketing',
  };

  it('renders WritingStylePreview with the correct props', () => {
    const { getByTestId } = render(<PreviewTab writingStyle={mockWritingStyle} />);
    
    const previewComponent = getByTestId('writing-style-preview');
    const passedProps = JSON.parse(previewComponent.getAttribute('data-writing-style') || '{}');
    
    expect(passedProps.voiceAnalysis).toBe('Test voice');
    expect(passedProps.generalStyleGuide).toBe('Test style');
    expect(passedProps.vocabularyPatterns).toBe('Test vocabulary');
    expect(passedProps.avoidPatterns).toBe('Test avoid');
    expect(passedProps.linkedinStyleGuide).toBe('Test LinkedIn');
    expect(passedProps.newsletterStyleGuide).toBe('Test newsletter');
    expect(passedProps.marketingStyleGuide).toBe('Test marketing');
  });
});
