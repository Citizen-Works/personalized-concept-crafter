
import React from 'react';
import { VoiceAnalysisCard } from './VoiceAnalysisCard';
import { GeneralStyleCard } from './GeneralStyleCard';
import { LanguagePatternsCard } from './LanguagePatternsCard';

interface GeneralStyleTabProps {
  voiceAnalysis: string;
  generalStyleGuide: string;
  vocabularyPatterns: string;
  avoidPatterns: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const GeneralStyleTab: React.FC<GeneralStyleTabProps> = ({
  voiceAnalysis,
  generalStyleGuide,
  vocabularyPatterns,
  avoidPatterns,
  handleInputChange,
}) => {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <VoiceAnalysisCard 
          value={voiceAnalysis} 
          onChange={handleInputChange} 
        />
        
        <GeneralStyleCard 
          value={generalStyleGuide} 
          onChange={handleInputChange} 
        />
      </div>
      
      <LanguagePatternsCard 
        vocabularyValue={vocabularyPatterns} 
        avoidValue={avoidPatterns} 
        onChange={handleInputChange} 
      />
    </div>
  );
};
