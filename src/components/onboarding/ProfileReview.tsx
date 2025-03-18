import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Check, Plus, X } from 'lucide-react';
import { ProfileData, NewContentPillar, NewTargetAudience } from '@/services/onboardingAssistantService';

interface ProfileReviewProps {
  profileData: ProfileData;
  onApprove: (modifiedData: ProfileData) => void;
  onContinueChat: () => void;
}

const ProfileReview: React.FC<ProfileReviewProps> = ({
  profileData,
  onApprove,
  onContinueChat
}) => {
  const [editedData, setEditedData] = useState<ProfileData>({...profileData});
  
  const handleUserProfileChange = (field: string, value: string) => {
    setEditedData({
      ...editedData,
      userProfile: {
        ...editedData.userProfile,
        [field]: value
      }
    });
  };
  
  const handleContentPillarChange = (index: number, field: string, value: string) => {
    const updatedPillars = [...editedData.contentPillars];
    updatedPillars[index] = {
      ...updatedPillars[index],
      [field]: value
    };
    
    setEditedData({
      ...editedData,
      contentPillars: updatedPillars
    });
  };
  
  const handleAddContentPillar = () => {
    setEditedData({
      ...editedData,
      contentPillars: [
        ...editedData.contentPillars,
        { name: '', description: '' }
      ]
    });
  };
  
  const handleRemoveContentPillar = (index: number) => {
    const updatedPillars = [...editedData.contentPillars];
    updatedPillars.splice(index, 1);
    
    setEditedData({
      ...editedData,
      contentPillars: updatedPillars
    });
  };
  
  const handleTargetAudienceChange = (index: number, field: string, value: string | string[]) => {
    const updatedAudiences = [...editedData.targetAudiences];
    updatedAudiences[index] = {
      ...updatedAudiences[index],
      [field]: value
    };
    
    setEditedData({
      ...editedData,
      targetAudiences: updatedAudiences
    });
  };
  
  const handleAddTargetAudience = () => {
    setEditedData({
      ...editedData,
      targetAudiences: [
        ...editedData.targetAudiences,
        { name: '', description: '', painPoints: [], goals: [] }
      ]
    });
  };
  
  const handleRemoveTargetAudience = (index: number) => {
    const updatedAudiences = [...editedData.targetAudiences];
    updatedAudiences.splice(index, 1);
    
    setEditedData({
      ...editedData,
      targetAudiences: updatedAudiences
    });
  };
  
  const handleWritingStyleChange = (field: string, value: string) => {
    setEditedData({
      ...editedData,
      writingStyle: {
        ...editedData.writingStyle,
        [field]: value
      }
    });
  };
  
  const handleArrayItemChange = (audienceIndex: number, field: keyof Pick<NewTargetAudience, 'painPoints' | 'goals'>, itemIndex: number, value: string) => {
    const audience = editedData.targetAudiences[audienceIndex];
    const array = [...audience[field]];
    array[itemIndex] = value;
    
    handleTargetAudienceChange(audienceIndex, field, array);
  };
  
  const handleAddArrayItem = (audienceIndex: number, field: keyof Pick<NewTargetAudience, 'painPoints' | 'goals'>) => {
    const audience = editedData.targetAudiences[audienceIndex];
    const array = [...audience[field], ''];
    
    handleTargetAudienceChange(audienceIndex, field, array);
  };
  
  const handleRemoveArrayItem = (audienceIndex: number, field: keyof Pick<NewTargetAudience, 'painPoints' | 'goals'>, itemIndex: number) => {
    const audience = editedData.targetAudiences[audienceIndex];
    const array = [...audience[field]];
    array.splice(itemIndex, 1);
    
    handleTargetAudienceChange(audienceIndex, field, array);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Review Your Profile</CardTitle>
        <CardDescription>
          Review and edit the information extracted from our conversation before saving to your profile.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="business">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="pillars">Content Pillars</TabsTrigger>
            <TabsTrigger value="audiences">Target Audiences</TabsTrigger>
            <TabsTrigger value="style">Writing Style</TabsTrigger>
          </TabsList>
          
          <TabsContent value="business" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input 
                id="businessName" 
                value={editedData.userProfile.businessName || ''} 
                onChange={(e) => handleUserProfileChange('businessName', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="businessDescription">Business Description</Label>
              <Textarea 
                id="businessDescription" 
                value={editedData.userProfile.businessDescription || ''} 
                onChange={(e) => handleUserProfileChange('businessDescription', e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Your Job Title</Label>
              <Input 
                id="jobTitle" 
                value={editedData.userProfile.jobTitle || ''} 
                onChange={(e) => handleUserProfileChange('jobTitle', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
              <Input 
                id="linkedinUrl" 
                value={editedData.userProfile.linkedinUrl || ''} 
                onChange={(e) => handleUserProfileChange('linkedinUrl', e.target.value)}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="pillars" className="space-y-4">
            {editedData.contentPillars.map((pillar, index) => (
              <Card key={index} className="relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2"
                  onClick={() => handleRemoveContentPillar(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <CardHeader>
                  <CardTitle className="text-base">Content Pillar {index + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`pillar-name-${index}`}>Name</Label>
                    <Input 
                      id={`pillar-name-${index}`} 
                      value={pillar.name} 
                      onChange={(e) => handleContentPillarChange(index, 'name', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`pillar-description-${index}`}>Description</Label>
                    <Textarea 
                      id={`pillar-description-${index}`} 
                      value={pillar.description} 
                      onChange={(e) => handleContentPillarChange(index, 'description', e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Button onClick={handleAddContentPillar} className="w-full flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Add Content Pillar
            </Button>
          </TabsContent>
          
          <TabsContent value="audiences" className="space-y-4">
            {editedData.targetAudiences.map((audience, index) => (
              <Card key={index} className="relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2"
                  onClick={() => handleRemoveTargetAudience(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <CardHeader>
                  <CardTitle className="text-base">Target Audience {index + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`audience-name-${index}`}>Audience Name</Label>
                    <Input 
                      id={`audience-name-${index}`} 
                      value={audience.name} 
                      onChange={(e) => handleTargetAudienceChange(index, 'name', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`audience-description-${index}`}>Description</Label>
                    <Textarea 
                      id={`audience-description-${index}`} 
                      value={audience.description} 
                      onChange={(e) => handleTargetAudienceChange(index, 'description', e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Pain Points</Label>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleAddArrayItem(index, 'painPoints')}
                        className="h-8 text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {audience.painPoints.map((point, pointIndex) => (
                        <div key={pointIndex} className="flex gap-2">
                          <Input 
                            value={point} 
                            onChange={(e) => handleArrayItemChange(index, 'painPoints', pointIndex, e.target.value)}
                          />
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRemoveArrayItem(index, 'painPoints', pointIndex)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Goals</Label>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleAddArrayItem(index, 'goals')}
                        className="h-8 text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {audience.goals.map((goal, goalIndex) => (
                        <div key={goalIndex} className="flex gap-2">
                          <Input 
                            value={goal} 
                            onChange={(e) => handleArrayItemChange(index, 'goals', goalIndex, e.target.value)}
                          />
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRemoveArrayItem(index, 'goals', goalIndex)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Button onClick={handleAddTargetAudience} className="w-full flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Add Target Audience
            </Button>
          </TabsContent>
          
          <TabsContent value="style" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="voiceAnalysis">Voice Analysis</Label>
              <Textarea 
                id="voiceAnalysis" 
                value={editedData.writingStyle.voiceAnalysis || ''} 
                onChange={(e) => handleWritingStyleChange('voiceAnalysis', e.target.value)}
                rows={3}
                placeholder="Overall tone and style of your writing"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="generalStyleGuide">General Style Guide</Label>
              <Textarea 
                id="generalStyleGuide" 
                value={editedData.writingStyle.generalStyleGuide || ''} 
                onChange={(e) => handleWritingStyleChange('generalStyleGuide', e.target.value)}
                rows={3}
                placeholder="General writing guidelines"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkedinStyleGuide">LinkedIn Style Guide</Label>
              <Textarea 
                id="linkedinStyleGuide" 
                value={editedData.writingStyle.linkedinStyleGuide || ''} 
                onChange={(e) => handleWritingStyleChange('linkedinStyleGuide', e.target.value)}
                rows={3}
                placeholder="How LinkedIn content should be written"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newsletterStyleGuide">Newsletter Style Guide</Label>
              <Textarea 
                id="newsletterStyleGuide" 
                value={editedData.writingStyle.newsletterStyleGuide || ''} 
                onChange={(e) => handleWritingStyleChange('newsletterStyleGuide', e.target.value)}
                rows={3}
                placeholder="How newsletter content should be written"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="marketingStyleGuide">Marketing Style Guide</Label>
              <Textarea 
                id="marketingStyleGuide" 
                value={editedData.writingStyle.marketingStyleGuide || ''} 
                onChange={(e) => handleWritingStyleChange('marketingStyleGuide', e.target.value)}
                rows={3}
                placeholder="How marketing copy should be written"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vocabularyPatterns">Vocabulary Patterns</Label>
              <Textarea 
                id="vocabularyPatterns" 
                value={editedData.writingStyle.vocabularyPatterns || ''} 
                onChange={(e) => handleWritingStyleChange('vocabularyPatterns', e.target.value)}
                rows={3}
                placeholder="Phrases, words, terminology to use"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="avoidPatterns">Patterns to Avoid</Label>
              <Textarea 
                id="avoidPatterns" 
                value={editedData.writingStyle.avoidPatterns || ''} 
                onChange={(e) => handleWritingStyleChange('avoidPatterns', e.target.value)}
                rows={3}
                placeholder="Phrases, words, terminology to avoid"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onContinueChat}>
          Continue Conversation
        </Button>
        <Button onClick={() => onApprove(editedData)}>
          <Check className="h-4 w-4 mr-2" />
          Save to Profile
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileReview;
