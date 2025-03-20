
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ContentPillar, TargetAudience } from '@/types';
import { PillarAudienceLink } from '@/types/strategy';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

interface PillarAudienceListProps {
  pillars: ContentPillar[];
  audiences: TargetAudience[];
  links: PillarAudienceLink[];
  onLinkChange: (pillarId: string, audienceId: string, strength: number | null) => void;
}

export const PillarAudienceList: React.FC<PillarAudienceListProps> = ({
  pillars,
  audiences,
  links,
  onLinkChange
}) => {
  const getPillarLinks = (pillarId: string) => {
    return links
      .filter(l => l.pillarId === pillarId)
      .sort((a, b) => b.relationshipStrength - a.relationshipStrength);
  };

  const getAudienceLinks = (audienceId: string) => {
    return links
      .filter(l => l.audienceId === audienceId)
      .sort((a, b) => b.relationshipStrength - a.relationshipStrength);
  };

  const getAudienceById = (id: string) => {
    return audiences.find(a => a.id === id);
  };

  const getPillarById = (id: string) => {
    return pillars.find(p => p.id === id);
  };

  const getStrengthLabel = (strength: number): string => {
    if (strength >= 8) return 'Strong';
    if (strength >= 4) return 'Medium';
    return 'Weak';
  };

  const getStrengthColor = (strength: number): string => {
    if (strength >= 8) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    if (strength >= 4) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
  };

  return (
    <div className="space-y-8 mb-8">
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Content Pillars</h2>
          {pillars.map(pillar => {
            const pillarLinks = getPillarLinks(pillar.id);
            return (
              <Card key={pillar.id}>
                <CardHeader>
                  <CardTitle>{pillar.name}</CardTitle>
                  {pillar.description && (
                    <CardDescription>{pillar.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <h3 className="font-medium mb-2">Relevant Audiences:</h3>
                  {pillarLinks.length > 0 ? (
                    <div className="space-y-2">
                      {pillarLinks.map(link => {
                        const audience = getAudienceById(link.audienceId);
                        if (!audience) return null;
                        return (
                          <div key={link.id} className="flex justify-between items-center">
                            <span>{audience.name}</span>
                            <Badge className={getStrengthColor(link.relationshipStrength)}>
                              {getStrengthLabel(link.relationshipStrength)} ({link.relationshipStrength})
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No audiences connected to this pillar yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Target Audiences</h2>
          {audiences.map(audience => {
            const audienceLinks = getAudienceLinks(audience.id);
            return (
              <Card key={audience.id}>
                <CardHeader>
                  <CardTitle>{audience.name}</CardTitle>
                  {audience.description && (
                    <CardDescription>{audience.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <h3 className="font-medium mb-2">Relevant Content Pillars:</h3>
                  {audienceLinks.length > 0 ? (
                    <div className="space-y-2">
                      {audienceLinks.map(link => {
                        const pillar = getPillarById(link.pillarId);
                        if (!pillar) return null;
                        return (
                          <div key={link.id} className="flex justify-between items-center">
                            <span>{pillar.name}</span>
                            <Badge className={getStrengthColor(link.relationshipStrength)}>
                              {getStrengthLabel(link.relationshipStrength)} ({link.relationshipStrength})
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No content pillars connected to this audience yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
