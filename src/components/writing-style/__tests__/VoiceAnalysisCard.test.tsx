
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { VoiceAnalysisCard } from '../VoiceAnalysisCard';

describe('VoiceAnalysisCard', () => {
  const mockOnChange = vi.fn();
  const mockValue = 'Test voice analysis content';

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with the correct title and description', () => {
    render(<VoiceAnalysisCard value={mockValue} onChange={mockOnChange} />);
    
    expect(screen.getByText('Voice Analysis')).toBeInTheDocument();
    expect(screen.getByText('Describe your unique writing voice and tone')).toBeInTheDocument();
  });

  it('displays the provided value in the textarea', () => {
    render(<VoiceAnalysisCard value={mockValue} onChange={mockOnChange} />);
    
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue(mockValue);
  });

  it('calls onChange handler when text is entered', () => {
    render(<VoiceAnalysisCard value={mockValue} onChange={mockOnChange} />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'New voice content' } });
    
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('displays the placeholder when no value is provided', () => {
    render(<VoiceAnalysisCard value="" onChange={mockOnChange} />);
    
    const textarea = screen.getByPlaceholderText('Describe your writing voice (e.g., professional but approachable, conversational with technical expertise)');
    expect(textarea).toBeInTheDocument();
  });
});
