
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type WritingStyleProfile = {
  id?: string;
  user_id: string;
  voice_analysis: string;
  general_style_guide: string;
  linkedin_style_guide: string;
  newsletter_style_guide: string;
  marketing_style_guide: string;
  vocabulary_patterns: string;
  avoid_patterns: string;
};

const WritingStylePage = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<WritingStyleProfile>({
    user_id: user?.id || '',
    voice_analysis: '',
    general_style_guide: '',
    linkedin_style_guide: '',
    newsletter_style_guide: '',
    marketing_style_guide: '',
    vocabulary_patterns: '',
    avoid_patterns: '',
  });

  useEffect(() => {
    if (user) {
      fetchWritingStyleProfile();
    }
  }, [user]);

  const fetchWritingStyleProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('writing_style_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        setProfile({
          id: data.id,
          user_id: data.user_id,
          voice_analysis: data.voice_analysis || '',
          general_style_guide: data.general_style_guide || '',
          linkedin_style_guide: data.linkedin_style_guide || '',
          newsletter_style_guide: data.newsletter_style_guide || '',
          marketing_style_guide: data.marketing_style_guide || '',
          vocabulary_patterns: data.vocabulary_patterns || '',
          avoid_patterns: data.avoid_patterns || '',
        });
      }
    } catch (error) {
      console.error('Error fetching writing style profile:', error);
      toast.error('Failed to load writing style profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      if (profile.id) {
        const { error } = await supabase
          .from('writing_style_profiles')
          .update({
            voice_analysis: profile.voice_analysis,
            general_style_guide: profile.general_style_guide,
            linkedin_style_guide: profile.linkedin_style_guide,
            newsletter_style_guide: profile.newsletter_style_guide,
            marketing_style_guide: profile.marketing_style_guide,
            vocabulary_patterns: profile.vocabulary_patterns,
            avoid_patterns: profile.avoid_patterns,
          })
          .eq('id', profile.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('writing_style_profiles')
          .insert([{
            user_id: user.id,
            voice_analysis: profile.voice_analysis,
            general_style_guide: profile.general_style_guide,
            linkedin_style_guide: profile.linkedin_style_guide,
            newsletter_style_guide: profile.newsletter_style_guide,
            marketing_style_guide: profile.marketing_style_guide,
            vocabulary_patterns: profile.vocabulary_patterns,
            avoid_patterns: profile.avoid_patterns,
          }]);
        
        if (error) throw error;
      }
      
      toast.success('Writing style profile saved successfully');
    } catch (error) {
      console.error('Error saving writing style profile:', error);
      toast.error('Failed to save writing style profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Writing Style</h1>
        <p className="text-muted-foreground">
          Define your unique writing style to ensure all generated content matches your voice
        </p>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Voice Analysis</CardTitle>
            <CardDescription>
              Describe your unique writing voice and tone
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              name="voice_analysis"
              value={profile.voice_analysis}
              onChange={handleChange}
              placeholder="Describe your writing voice (e.g., professional but approachable, conversational with technical expertise)"
              className="min-h-32"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>General Style Guide</CardTitle>
            <CardDescription>
              Define overall writing preferences and guidelines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              name="general_style_guide"
              value={profile.general_style_guide}
              onChange={handleChange}
              placeholder="General writing preferences (e.g., sentence length, paragraph structure, use of jargon)"
              className="min-h-32"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Content-Specific Style Guides</CardTitle>
            <CardDescription>
              Customize your style for different content types
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">LinkedIn Style</label>
              <Textarea
                name="linkedin_style_guide"
                value={profile.linkedin_style_guide}
                onChange={handleChange}
                placeholder="How you write LinkedIn posts (e.g., storytelling approach, use of emojis, post structure)"
                className="min-h-24"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Newsletter Style</label>
              <Textarea
                name="newsletter_style_guide"
                value={profile.newsletter_style_guide}
                onChange={handleChange}
                placeholder="How you write newsletters (e.g., section structure, introduction style, sign-off)"
                className="min-h-24"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Marketing Style</label>
              <Textarea
                name="marketing_style_guide"
                value={profile.marketing_style_guide}
                onChange={handleChange}
                placeholder="How you write marketing content (e.g., call-to-actions, value proposition style)"
                className="min-h-24"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Language Patterns</CardTitle>
            <CardDescription>
              Define specific vocabulary and patterns to use or avoid
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Vocabulary & Phrases to Use</label>
              <Textarea
                name="vocabulary_patterns"
                value={profile.vocabulary_patterns}
                onChange={handleChange}
                placeholder="Words, phrases or expressions you frequently use"
                className="min-h-24"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Patterns to Avoid</label>
              <Textarea
                name="avoid_patterns"
                value={profile.avoid_patterns}
                onChange={handleChange}
                placeholder="Words, phrases or structures you never use"
                className="min-h-24"
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Writing Profile'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WritingStylePage;
