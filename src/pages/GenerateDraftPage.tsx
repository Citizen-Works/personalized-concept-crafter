
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useGenerateDraft } from "@/components/generate-draft/useGenerateDraft";
import IdeaSelector from "@/components/generate-draft/IdeaSelector";
import ContentParametersCard from "@/components/generate-draft/ContentParametersCard";
import DraftPreviewCard from "@/components/generate-draft/DraftPreviewCard";
import DebugPromptDialog from "@/components/generate-draft/DebugPromptDialog";

const GenerateDraftPage = () => {
  const {
    ideas,
    isLoadingIdeas,
    callToActions,
    selectedIdea,
    setSelectedIdea,
    contentType,
    setContentType,
    contentGoal,
    setContentGoal,
    callToAction,
    setCallToAction,
    lengthPreference,
    setLengthPreference,
    generatedContent,
    setGeneratedContent,
    isEditing,
    setIsEditing,
    progress,
    isGenerating,
    debugPrompt,
    showDebugDialog,
    setShowDebugDialog,
    handleGenerate,
    handleDebugPrompt,
    handleSaveDraft
  } = useGenerateDraft();
  
  // Convert CallToAction objects to strings array
  const ctaTexts = callToActions.length > 0 
    ? callToActions.map(cta => cta.text)
    : [];

  return (
    <div className="container space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Generate Draft</h1>
          <p className="text-muted-foreground">Create a draft for an approved content idea</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/pipeline?tab=ideas" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Ideas
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left Column - Content Idea Selection & Parameters */}
        <div className="space-y-6 md:col-span-1">
          <IdeaSelector
            ideas={ideas}
            selectedIdea={selectedIdea}
            setSelectedIdea={setSelectedIdea}
            isLoading={isLoadingIdeas}
          />
          
          <ContentParametersCard
            contentType={contentType}
            setContentType={setContentType}
            contentGoal={contentGoal}
            setContentGoal={setContentGoal}
            callToAction={callToAction}
            setCallToAction={setCallToAction}
            lengthPreference={lengthPreference}
            setLengthPreference={setLengthPreference}
            callToActions={ctaTexts}
            handleGenerate={handleGenerate}
            handleDebugPrompt={handleDebugPrompt}
            isGenerating={isGenerating}
            selectedIdea={!!selectedIdea}
          />
        </div>
        
        {/* Right Column - Content Preview & Actions */}
        <div className="md:col-span-2">
          <DraftPreviewCard
            selectedIdea={selectedIdea}
            isGenerating={isGenerating}
            generatedContent={generatedContent}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            setGeneratedContent={setGeneratedContent}
            handleGenerate={handleGenerate}
            handleSaveDraft={handleSaveDraft}
            progress={progress}
          />
        </div>
      </div>

      {/* Debug Prompt Dialog */}
      <DebugPromptDialog
        showDialog={showDebugDialog}
        setShowDialog={setShowDebugDialog}
        debugPrompt={debugPrompt}
      />
    </div>
  );
};

export default GenerateDraftPage;
