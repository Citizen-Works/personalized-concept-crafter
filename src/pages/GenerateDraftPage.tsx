
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "@/components/ui/command";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ArrowLeft, Check, Edit, FileText, Loader2, Lightbulb, RefreshCcw, Save, Trash2, Search } from "lucide-react";
import { ContentIdea, ContentType } from "@/types";
import { useIdeas } from "@/hooks/ideas";
import { useClaudeAI } from "@/hooks/useClaudeAI";
import { useDrafts } from "@/hooks/useDrafts";
import { useCallToActions } from "@/hooks/useCallToActions";

// Content goal type
type ContentGoal = 'audience_building' | 'lead_generation' | 'nurturing' | 'conversion' | 'retention' | 'other';

const GenerateDraftPage = () => {
  const navigate = useNavigate();
  const { ideas, isLoading: isLoadingIdeas } = useIdeas();
  const { generateContent, isGenerating } = useClaudeAI();
  const { createDraft } = useDrafts();
  const { callToActions, isLoading: isLoadingCTAs } = useCallToActions();
  
  // States
  const [open, setOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<ContentIdea | null>(null);
  const [contentType, setContentType] = useState<ContentType>("linkedin");
  const [contentGoal, setContentGoal] = useState<ContentGoal | null>(null);
  const [callToAction, setCallToAction] = useState<string>("");
  const [lengthPreference, setLengthPreference] = useState<"shorter" | "longer" | "standard">("standard");
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Filter approved ideas (those that don't have drafts yet)
  const approvedIdeas = ideas.filter(idea => idea.status === 'approved');
  
  // Format the content goal for display
  const formatContentGoal = (goal: string): string => {
    return goal.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  // Progress animation effect when generating content
  useEffect(() => {
    let progressInterval: ReturnType<typeof setInterval>;
    
    if (isGenerating) {
      // Reset progress when starting generation
      setProgress(0);
      
      // Create a realistic-looking progress animation
      progressInterval = setInterval(() => {
        setProgress(currentProgress => {
          // Move quickly to 70%, then slow down to simulate waiting for the API
          if (currentProgress < 70) {
            return currentProgress + 2;
          } else {
            // Slow down as we approach 90%
            return Math.min(currentProgress + 0.5, 90);
          }
        });
      }, 150);
    } else if (progress > 0) {
      // When generation completes, jump to 100%
      setProgress(100);
      
      // Reset progress after a delay
      const resetTimeout = setTimeout(() => {
        setProgress(0);
      }, 1000);
      
      return () => clearTimeout(resetTimeout);
    }
    
    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isGenerating, progress]);
  
  const handleGenerate = async () => {
    if (!selectedIdea) {
      toast.error('Please select a content idea first');
      return;
    }
    
    try {
      // Add the content goal and CTA to the idea notes if provided
      let ideaWithParams = { ...selectedIdea };
      let notes = selectedIdea.notes || "";
      
      if (contentGoal) {
        notes = `Content Goal: ${contentGoal.replace('_', ' ')}\n\n${notes}`;
      }
      
      if (callToAction) {
        notes = `${notes}\n\nCall to Action: ${callToAction}`;
      }
      
      if (lengthPreference !== "standard") {
        notes = `${notes}\n\nLength Preference: ${lengthPreference}`;
      }
      
      ideaWithParams.notes = notes;
      ideaWithParams.contentType = contentType;
      
      // Generate content
      const content = await generateContent(ideaWithParams, contentType);
      if (content) {
        setGeneratedContent(content);
      }
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate content');
    }
  };
  
  const handleSaveDraft = async () => {
    if (!selectedIdea || !generatedContent) {
      toast.error('No content to save');
      return;
    }
    
    try {
      // Create a draft
      await createDraft({
        contentIdeaId: selectedIdea.id,
        content: generatedContent,
        version: 1,
        feedback: '',
      });
      
      // Update the idea status to drafted
      const { updateIdea } = useIdeas();
      await updateIdea({
        id: selectedIdea.id,
        status: 'drafted',
        contentType: contentType
      });
      
      toast.success('Draft saved successfully');
      navigate(`/pipeline?tab=drafts`);
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft');
    }
  };
  
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
          <Card>
            <CardHeader>
              <CardTitle>Content Idea</CardTitle>
              <CardDescription>Select an approved idea to draft</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Content Idea Selector */}
              <div className="space-y-2">
                <Label htmlFor="idea-select">Select an idea</Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                      disabled={isLoadingIdeas}
                    >
                      {selectedIdea
                        ? `${selectedIdea.title.substring(0, 40)}${selectedIdea.title.length > 40 ? '...' : ''}`
                        : "Select an idea..."}
                      <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search ideas..." />
                      <CommandList>
                        <CommandEmpty>No ideas found</CommandEmpty>
                        <CommandGroup>
                          {approvedIdeas.map((idea) => (
                            <CommandItem
                              key={idea.id}
                              value={idea.title}
                              onSelect={() => {
                                setSelectedIdea(idea);
                                setOpen(false);
                              }}
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              {idea.title}
                              {selectedIdea?.id === idea.id && (
                                <Check className="ml-auto h-4 w-4" />
                              )}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              
              {/* Selected Idea Details */}
              {selectedIdea && (
                <Card className="bg-muted/50">
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-medium">{selectedIdea.title}</h3>
                    {selectedIdea.description && (
                      <p className="text-sm text-muted-foreground">{selectedIdea.description}</p>
                    )}
                    <Badge variant="outline" className="text-xs">
                      ID: {selectedIdea.id.substring(0, 8)}
                    </Badge>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Content Parameters</CardTitle>
              <CardDescription>Customize the draft generation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Content Type Selection */}
              <div className="space-y-2">
                <Label>Content Type</Label>
                <Tabs defaultValue={contentType} onValueChange={(value) => setContentType(value as ContentType)}>
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
                    <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
                    <TabsTrigger value="marketing">Marketing</TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="text-xs text-muted-foreground mt-1 pl-1">
                  {contentType === "linkedin" && "Short, engaging post for social sharing"}
                  {contentType === "newsletter" && "Longer, more detailed content for email"}
                  {contentType === "marketing" && "Persuasive copy with clear CTA"}
                </div>
              </div>
              
              <Separator />
              
              {/* Optional Parameters */}
              <div className="space-y-2">
                <Label>Content Goal (Optional)</Label>
                <Select value={contentGoal || ""} onValueChange={(value) => setContentGoal(value as ContentGoal || null)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a goal (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No specific goal</SelectItem>
                    <SelectItem value="audience_building">Audience Building</SelectItem>
                    <SelectItem value="lead_generation">Lead Generation</SelectItem>
                    <SelectItem value="nurturing">Nurturing</SelectItem>
                    <SelectItem value="conversion">Conversion</SelectItem>
                    <SelectItem value="retention">Retention</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Call to Action (Optional)</Label>
                <Select value={callToAction} onValueChange={setCallToAction}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a CTA (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No call to action</SelectItem>
                    {callToActions.map((cta) => (
                      <SelectItem key={cta.id} value={cta.text}>
                        {cta.text}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Length Preference</Label>
                <RadioGroup defaultValue="standard" onValueChange={(value) => setLengthPreference(value as "shorter" | "longer" | "standard")}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="shorter" id="shorter" />
                    <Label htmlFor="shorter">Shorter</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard">Standard</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="longer" id="longer" />
                    <Label htmlFor="longer">Longer</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleGenerate} 
                disabled={!selectedIdea || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Generate Draft
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Content Preview & Actions */}
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Draft Preview</span>
                {generatedContent && !isGenerating && (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      {isEditing ? "View" : "Edit"}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleGenerate}
                    >
                      <RefreshCcw className="h-4 w-4 mr-1" />
                      Regenerate
                    </Button>
                  </div>
                )}
              </CardTitle>
              <CardDescription>
                {selectedIdea ? 
                  `Preview for: ${selectedIdea.title}` : 
                  "Select an idea to generate content"}
              </CardDescription>
            </CardHeader>
            <CardContent className="min-h-[500px] flex flex-col">
              {isGenerating ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <div className="text-center space-y-2">
                    <p>Generating draft content...</p>
                    <p className="text-sm text-muted-foreground">This may take a moment</p>
                    {progress > 0 && (
                      <div className="w-full max-w-xs mx-auto">
                        <Progress value={progress} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1 text-center">
                          {progress < 100 ? 'Thinking and crafting content...' : 'Complete!'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : !selectedIdea ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground">
                  <FileText className="h-12 w-12 mb-4 opacity-20" />
                  <h3 className="text-lg font-medium">No idea selected</h3>
                  <p className="max-w-sm">
                    Select a content idea from the left panel to generate a draft
                  </p>
                </div>
              ) : generatedContent ? (
                isEditing ? (
                  <Textarea 
                    value={generatedContent} 
                    onChange={(e) => setGeneratedContent(e.target.value)}
                    className="flex-1 min-h-[450px] resize-none"
                  />
                ) : (
                  <div className="flex-1 whitespace-pre-wrap bg-card rounded-md p-4 overflow-y-auto">
                    {generatedContent}
                  </div>
                )
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground">
                  <Lightbulb className="h-12 w-12 mb-4 opacity-20" />
                  <h3 className="text-lg font-medium">Ready to generate</h3>
                  <p className="max-w-sm">
                    Click the "Generate Draft" button to create content based on your selected idea
                  </p>
                </div>
              )}
              
              {generatedContent && !isGenerating && (
                <div className="mt-6 flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setGeneratedContent("")}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Discard
                  </Button>
                  <Button onClick={handleSaveDraft}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Draft
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GenerateDraftPage;
