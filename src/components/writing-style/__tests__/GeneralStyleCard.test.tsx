
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GeneralStyleCard } from '../GeneralStyleCard';

describe('GeneralStyleCard', () => {
  const mockOnChange = vi.fn();
  const mockValue = 'Test general style guide content';

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with the correct title and description', () => {
    render(<GeneralStyleCard value={mockValue} onChange={mockOnChange} />);
    
    expect(screen.getByText('General Style Guide')).toBeInTheDocument();
    expect(screen.getByText('Define overall writing preferences and guidelines')).toBeInTheDocument();
  });

  it('displays the provided value in the textarea', () => {
    render(<GeneralStyleCard value={mockValue} onChange={mockOnChange} />);
    
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue(mockValue);
  });

  it('calls onChange handler when text is entered', () => {
    render(<GeneralStyleCard value={mockValue} onChange={mockOnChange} />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'New content' } });
    
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('displays the placeholder when no value is provided', () => {
    render(<GeneralStyleCard value="" onChange={mockOnChange} />);
    
    const textarea = screen.getByPlaceholderText('General writing preferences (e.g., sentence length, paragraph structure, use of jargon)');
    expect(textarea).toBeInTheDocument();
  });
});
