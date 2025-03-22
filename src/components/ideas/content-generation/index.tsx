
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContentIdea, ContentType } from '@/types';
import { useContentGeneration } from './useContentGeneration';
import ContentTypeSelector from './ContentTypeSelector';
import ErrorDisplay from './ErrorDisplay';
import GenerateButton from './GenerateButton';
import GenerationProgress from './GenerationProgress';
import GeneratedContentEditor from './GeneratedContentEditor';
import CallToActionBadge from './CallToActionBadge';

interface IdeaContentGenerationProps {
  idea: ContentIdea;
  onGenerateDraft: (contentType: ContentType, content: string) => Promise<void>;
}

const IdeaContentGeneration: React.FC<IdeaContentGenerationProps> = ({
  idea,
  onGenerateDraft
}) => {
  const {
    selectedContentType,
    setSelectedContentType,
    generatedContent,
    setGeneratedContent,
    isGenerating,
    error,
    progress,
    callToAction,
    handleGenerateContent,
    handleClearContent
  } = useContentGeneration(idea);
  
  const handleSaveAsDraft = async () => {
    try {
      await onGenerateDraft(selectedContentType, generatedContent);
      // Clear the content after saving
      setGeneratedContent('');
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Generate Content</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CallToActionBadge callToAction={callToAction} />
        
        <ContentTypeSelector 
          selectedContentType={selectedContentType}
          onContentTypeChange={setSelectedContentType}
        />
        
        <ErrorDisplay error={error} />
        
        {!isGenerating && !generatedContent ? (
          <GenerateButton 
            contentType={selectedContentType}
            onClick={handleGenerateContent}
            disabled={isGenerating}
          />
        ) : (
          <div className="space-y-4">
            {isGenerating ? (
              <GenerationProgress progress={progress} />
            ) : (
              <GeneratedContentEditor
                content={generatedContent}
                onContentChange={setGeneratedContent}
                onClear={handleClearContent}
                onRegenerate={handleGenerateContent}
                onSaveAsDraft={handleSaveAsDraft}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IdeaContentGeneration;
