
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContentPillars } from '@/hooks/useContentPillars';
import { useTargetAudiences } from '@/hooks/useTargetAudiences';
import { usePillarAudienceLinks } from '@/hooks/usePillarAudienceLinks';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PillarAudienceMatrix } from '@/components/Strategy/PillarAudienceMatrix';
import { PillarAudienceList } from '@/components/Strategy/PillarAudienceList';

const PillarAudienceLinkPage = () => {
  const [activeTab, setActiveTab] = useState("matrix");
  const { contentPillars, isLoading: isPillarsLoading } = useContentPillars();
  const { targetAudiences, isLoading: isAudiencesLoading } = useTargetAudiences();
  const { 
    pillarAudienceLinks, 
    isLoading: isLinksLoading, 
    createLink, 
    updateLink, 
    deleteLink 
  } = usePillarAudienceLinks();
  
  const isLoading = isPillarsLoading || isAudiencesLoading || isLinksLoading;
  
  // Filter out archived items
  const activePillars = contentPillars.filter(pillar => !pillar.isArchived);
  const activeAudiences = targetAudiences.filter(audience => !audience.isArchived);

  const handleLinkChange = (pillarId: string, audienceId: string, strength: number | null) => {
    // Find if link already exists
    const existingLink = pillarAudienceLinks.find(
      link => link.pillarId === pillarId && link.audienceId === audienceId
    );
    
    if (strength === null && existingLink) {
      // Delete link if strength is null and link exists
      deleteLink.mutate(existingLink.id);
    } else if (strength !== null) {
      if (existingLink) {
        // Update existing link
        updateLink.mutate({
          id: existingLink.id,
          relationshipStrength: strength
        });
      } else {
        // Create new link
        createLink.mutate({
          pillarId,
          audienceId,
          relationshipStrength: strength
        });
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Content & Audience Mapping</h1>
          <p className="text-muted-foreground">
            Map your content pillars to your target audiences
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/strategy" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Strategy
          </Link>
        </Button>
      </div>
      
      {isLoading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {activePillars.length === 0 || activeAudiences.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Missing Strategy Elements</CardTitle>
                <CardDescription>
                  You need to create both content pillars and target audiences to use this feature
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {activePillars.length === 0 && (
                  <div>
                    <h3 className="font-medium mb-2">No Active Content Pillars</h3>
                    <p className="text-muted-foreground mb-2">
                      You need to create at least one content pillar.
                    </p>
                    <Button asChild>
                      <Link to="/strategy/content-pillars">Create Content Pillars</Link>
                    </Button>
                  </div>
                )}
                
                {activeAudiences.length === 0 && (
                  <div>
                    <h3 className="font-medium mb-2">No Active Target Audiences</h3>
                    <p className="text-muted-foreground mb-2">
                      You need to create at least one target audience.
                    </p>
                    <Button asChild>
                      <Link to="/strategy/target-audiences">Create Target Audiences</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              <Tabs defaultValue="matrix" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="matrix">Matrix View</TabsTrigger>
                  <TabsTrigger value="list">List View</TabsTrigger>
                </TabsList>
                
                <TabsContent value="matrix">
                  <PillarAudienceMatrix 
                    pillars={activePillars}
                    audiences={activeAudiences}
                    links={pillarAudienceLinks}
                    onLinkChange={handleLinkChange}
                  />
                </TabsContent>
                
                <TabsContent value="list">
                  <PillarAudienceList 
                    pillars={activePillars}
                    audiences={activeAudiences}
                    links={pillarAudienceLinks}
                    onLinkChange={handleLinkChange}
                  />
                </TabsContent>
              </Tabs>
              
              <Card>
                <CardHeader>
                  <CardTitle>Relationship Strength Guide</CardTitle>
                  <CardDescription>
                    How to interpret the relationship strength values
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="font-medium mb-1">Strong (8-10)</h3>
                      <p className="text-sm text-muted-foreground">
                        This pillar directly addresses key pain points or goals of this audience.
                        Content in this area should be a primary focus.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Medium (4-7)</h3>
                      <p className="text-sm text-muted-foreground">
                        This pillar is relevant to the audience but isn't their primary interest.
                        Include this content regularly but not as a main focus.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Weak (1-3)</h3>
                      <p className="text-sm text-muted-foreground">
                        This pillar has minimal relevance to the audience.
                        Create content in this area sparingly for this audience.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default PillarAudienceLinkPage;
