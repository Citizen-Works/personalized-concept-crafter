
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GeneralStyleTab } from '../GeneralStyleTab';

describe('GeneralStyleTab', () => {
  const mockHandleInputChange = vi.fn();
  const mockProps = {
    voiceAnalysis: 'Test voice analysis',
    generalStyleGuide: 'Test general style guide',
    vocabularyPatterns: 'Test vocabulary patterns',
    avoidPatterns: 'Test avoid patterns',
    handleInputChange: mockHandleInputChange,
  };

  beforeEach(() => {
    mockHandleInputChange.mockClear();
  });

  it('renders all necessary components', () => {
    render(<GeneralStyleTab {...mockProps} />);
    
    // Check that component structure is correct with expected sections
    expect(screen.getByText('Voice Analysis')).toBeInTheDocument();
    expect(screen.getByText('General Style Guide')).toBeInTheDocument();
    expect(screen.getByText('Language Patterns')).toBeInTheDocument();
  });

  it('passes correct props to child components', () => {
    render(<GeneralStyleTab {...mockProps} />);
    
    // Check that values are passed to textareas
    const voiceTextarea = screen.getByPlaceholderText('Describe your writing voice (e.g., professional but approachable, conversational with technical expertise)');
    const generalStyleTextarea = screen.getByPlaceholderText('General writing preferences (e.g., sentence length, paragraph structure, use of jargon)');
    const vocabularyTextarea = screen.getByPlaceholderText('Words, phrases or expressions you frequently use');
    const avoidTextarea = screen.getByPlaceholderText('Words, phrases or structures you never use');
    
    expect(voiceTextarea).toHaveValue('Test voice analysis');
    expect(generalStyleTextarea).toHaveValue('Test general style guide');
    expect(vocabularyTextarea).toHaveValue('Test vocabulary patterns');
    expect(avoidTextarea).toHaveValue('Test avoid patterns');
  });

  it('renders with responsive grid layout', () => {
    const { container } = render(<GeneralStyleTab {...mockProps} />);
    
    // Check for grid layout classes
    const gridDiv = container.querySelector('.grid.gap-6.grid-cols-1.lg\\:grid-cols-2');
    expect(gridDiv).toBeInTheDocument();
  });
});
