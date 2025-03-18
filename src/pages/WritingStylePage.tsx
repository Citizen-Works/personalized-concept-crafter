
import React from 'react';
import { Button } from "@/components/ui/button";
import { useWritingStyle } from '@/hooks/useWritingStyle';
import { WritingStyleHeader } from '@/components/writing-style/WritingStyleHeader';
import { VoiceAnalysisCard } from '@/components/writing-style/VoiceAnalysisCard';
import { GeneralStyleCard } from '@/components/writing-style/GeneralStyleCard';
import { ContentSpecificStyleCard } from '@/components/writing-style/ContentSpecificStyleCard';
import { LanguagePatternsCard } from '@/components/writing-style/LanguagePatternsCard';
import { WritingStylePreview } from '@/components/writing-style/WritingStylePreview';

const WritingStylePage = () => {
  const { profile, isLoading, isSaving, handleChange, saveProfile } = useWritingStyle();

  return (
    <div className="space-y-8">
      <WritingStyleHeader />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Settings forms */}
        <div className="space-y-6 lg:col-span-2">
          <VoiceAnalysisCard 
            value={profile.voice_analysis} 
            onChange={handleChange} 
          />
          
          <GeneralStyleCard 
            value={profile.general_style_guide} 
            onChange={handleChange} 
          />
          
          <ContentSpecificStyleCard 
            linkedinValue={profile.linkedin_style_guide}
            newsletterValue={profile.newsletter_style_guide}
            marketingValue={profile.marketing_style_guide}
            onChange={handleChange}
          />
          
          <LanguagePatternsCard 
            vocabularyValue={profile.vocabulary_patterns}
            avoidValue={profile.avoid_patterns}
            onChange={handleChange}
          />
          
          <div className="flex justify-end">
            <Button onClick={saveProfile} disabled={isSaving || isLoading}>
              {isSaving ? 'Saving...' : 'Save Writing Profile'}
            </Button>
          </div>
        </div>
        
        {/* Right column - Preview */}
        <div className="lg:col-span-1">
          <WritingStylePreview styleProfile={profile} />
        </div>
      </div>
    </div>
  );
};

export default WritingStylePage;
