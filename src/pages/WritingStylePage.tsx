
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { WritingStyleHeader } from '@/components/writing-style/WritingStyleHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/context/auth';
import { useWritingStyle } from '@/hooks/useWritingStyle';
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GeneralStyleTab } from '@/components/writing-style/GeneralStyleTab';
import { PlatformStyleTab } from '@/components/writing-style/PlatformStyleTab';
import { PreviewTab } from '@/components/writing-style/PreviewTab';
import { useWritingStyleForm } from '@/hooks/useWritingStyleForm';

const WritingStylePage = () => {
  const { user } = useAuth();
  const { profile, isLoading, refetch } = useWritingStyle();
  const [activeTab, setActiveTab] = useState("general");
  
  const {
    formState,
    handleInputChange,
    saveWritingStyle,
    isSaving,
    getPreviewProfile
  } = useWritingStyleForm(profile);

  // Function to handle save and refresh data
  const handleSave = async () => {
    await saveWritingStyle();
    // Refresh the data after saving instead of reloading the page
    refetch();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <WritingStyleHeader />
        <Button variant="outline" asChild>
          <Link to="/strategy" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Strategy
          </Link>
        </Button>
      </div>
      
      <div className="flex justify-between">
        <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General Style</TabsTrigger>
            <TabsTrigger value="platform">Platform Specific</TabsTrigger>
            <TabsTrigger value="preview">Preview & Test</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <GeneralStyleTab 
              voiceAnalysis={formState.voiceAnalysis || ''} 
              generalStyleGuide={formState.generalStyleGuide || ''}
              vocabularyPatterns={formState.vocabularyPatterns || ''}
              avoidPatterns={formState.avoidPatterns || ''}
              handleInputChange={handleInputChange}
            />
          </TabsContent>
          
          <TabsContent value="platform">
            <PlatformStyleTab 
              linkedinStyleGuide={formState.linkedinStyleGuide || ''} 
              newsletterStyleGuide={formState.newsletterStyleGuide || ''} 
              marketingStyleGuide={formState.marketingStyleGuide || ''} 
              handleInputChange={handleInputChange}
            />
          </TabsContent>
          
          <TabsContent value="preview">
            <PreviewTab writingStyle={getPreviewProfile()} />
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} className="flex items-center gap-1">
          <Save className="h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Writing Style'}
        </Button>
      </div>
    </div>
  );
};

export default WritingStylePage;
