
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { WritingStyleHeader } from '@/components/writing-style/WritingStyleHeader';
import { VoiceAnalysisCard } from '@/components/writing-style/VoiceAnalysisCard';
import { GeneralStyleCard } from '@/components/writing-style/GeneralStyleCard';
import { LanguagePatternsCard } from '@/components/writing-style/LanguagePatternsCard';
import { ContentSpecificStyleCard } from '@/components/writing-style/ContentSpecificStyleCard';
import { WritingStylePreview } from '@/components/writing-style/WritingStylePreview';
import { WritingStyleProfile } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useWritingStyle } from '@/hooks/useWritingStyle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const WritingStylePage = () => {
  const { user } = useAuth();
  const { profile, isLoading, saveProfile, handleChange, writingStyle, refetch } = useWritingStyle();
  const [activeTab, setActiveTab] = useState("general");
  
  const [formState, setFormState] = useState<Partial<WritingStyleProfile>>({
    voiceAnalysis: '',
    generalStyleGuide: '',
    vocabularyPatterns: '',
    avoidPatterns: '',
    linkedinStyleGuide: '',
    newsletterStyleGuide: '',
    marketingStyleGuide: '',
  });
  
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormState({
        voiceAnalysis: profile.voiceAnalysis || profile.voice_analysis || '',
        generalStyleGuide: profile.generalStyleGuide || profile.general_style_guide || '',
        vocabularyPatterns: profile.vocabularyPatterns || profile.vocabulary_patterns || '',
        avoidPatterns: profile.avoidPatterns || profile.avoid_patterns || '',
        linkedinStyleGuide: profile.linkedinStyleGuide || profile.linkedin_style_guide || '',
        newsletterStyleGuide: profile.newsletterStyleGuide || profile.newsletter_style_guide || '',
        marketingStyleGuide: profile.marketingStyleGuide || profile.marketing_style_guide || '',
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveWritingStyle = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      if (profile?.id) {
        // Update existing writing style
        await supabase
          .from('writing_style_profiles')
          .update({
            voice_analysis: formState.voiceAnalysis,
            general_style_guide: formState.generalStyleGuide,
            vocabulary_patterns: formState.vocabularyPatterns,
            avoid_patterns: formState.avoidPatterns,
            linkedin_style_guide: formState.linkedinStyleGuide,
            newsletter_style_guide: formState.newsletterStyleGuide,
            marketing_style_guide: formState.marketingStyleGuide,
          })
          .eq('id', profile.id);
      } else {
        // Create new writing style
        await supabase
          .from('writing_style_profiles')
          .insert({
            user_id: user.id,
            voice_analysis: formState.voiceAnalysis,
            general_style_guide: formState.generalStyleGuide,
            vocabulary_patterns: formState.vocabularyPatterns,
            avoid_patterns: formState.avoidPatterns,
            linkedin_style_guide: formState.linkedinStyleGuide,
            newsletter_style_guide: formState.newsletterStyleGuide,
            marketing_style_guide: formState.marketingStyleGuide,
            example_quotes: [],
            linkedin_examples: [],
            newsletter_examples: [],
            marketing_examples: [],
          });
      }
      
      toast.success('Writing style saved successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error saving writing style:', error);
      toast.error('Failed to save writing style');
    } finally {
      setIsSaving(false);
    }
  };

  // Create a preview object that includes fields for the WritingStylePreview component
  const getPreviewProfile = () => {
    return {
      // Use camelCase properties that match the type definition
      userId: user?.id || '',
      voiceAnalysis: formState.voiceAnalysis || '',
      generalStyleGuide: formState.generalStyleGuide || '',
      linkedinStyleGuide: formState.linkedinStyleGuide || '',
      newsletterStyleGuide: formState.newsletterStyleGuide || '',
      marketingStyleGuide: formState.marketingStyleGuide || '',
      vocabularyPatterns: formState.vocabularyPatterns || '',
      avoidPatterns: formState.avoidPatterns || '',
      
      // Include the snake_case aliases for backward compatibility
      voice_analysis: formState.voiceAnalysis || '',
      general_style_guide: formState.generalStyleGuide || '',
      linkedin_style_guide: formState.linkedinStyleGuide || '',
      newsletter_style_guide: formState.newsletterStyleGuide || '',
      marketing_style_guide: formState.marketingStyleGuide || '',
      vocabulary_patterns: formState.vocabularyPatterns || '',
      avoid_patterns: formState.avoidPatterns || '',
      
      // Optional properties with empty defaults
      id: profile?.id || '',
      exampleQuotes: [],
      linkedinExamples: [],
      newsletterExamples: [],
      marketingExamples: [],
      createdAt: profile?.createdAt || new Date(),
      updatedAt: profile?.updatedAt || new Date()
    };
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
          
          <TabsContent value="general" className="space-y-8">
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              <VoiceAnalysisCard 
                value={formState.voiceAnalysis || ''} 
                onChange={handleInputChange} 
              />
              
              <GeneralStyleCard 
                value={formState.generalStyleGuide || ''} 
                onChange={handleInputChange} 
              />
            </div>
            
            <LanguagePatternsCard 
              vocabularyValue={formState.vocabularyPatterns || ''} 
              avoidValue={formState.avoidPatterns || ''} 
              onChange={handleInputChange} 
            />
          </TabsContent>
          
          <TabsContent value="platform" className="space-y-8">
            <ContentSpecificStyleCard 
              linkedinValue={formState.linkedinStyleGuide || ''} 
              newsletterValue={formState.newsletterStyleGuide || ''} 
              marketingValue={formState.marketingStyleGuide || ''} 
              onChange={handleInputChange} 
            />
            
            <Card>
              <CardHeader>
                <CardTitle>Style Tips</CardTitle>
                <CardDescription>
                  Tips for platform-specific writing styles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">LinkedIn</h4>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                      <li>Keep paragraphs short and skimmable</li>
                      <li>Start with a compelling hook</li>
                      <li>Use line breaks to create visual rhythm</li>
                      <li>End with a clear call to action or question</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Newsletter</h4>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                      <li>Personal and conversational tone works best</li>
                      <li>Create consistent sections readers can expect</li>
                      <li>Use subheadings and bullet points for scanability</li>
                      <li>Include a mix of content types: insights, tips, news, etc.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Marketing</h4>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                      <li>Focus on benefits rather than features</li>
                      <li>Use active voice and present tense</li>
                      <li>Address objections proactively</li>
                      <li>Create a sense of urgency when appropriate</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preview">
            <WritingStylePreview writingStyle={getPreviewProfile()} />
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={saveWritingStyle} disabled={isSaving} className="flex items-center gap-1">
          <Save className="h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Writing Style'}
        </Button>
      </div>
    </div>
  );
};

export default WritingStylePage;
