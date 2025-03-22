
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContentPillar, TargetAudience } from '@/types';
import { PillarAudienceLink } from '@/types/strategy';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createResponsiveComponent } from '@/components/ui/responsive-container';

interface PillarAudienceMatrixProps {
  pillars: ContentPillar[];
  audiences: TargetAudience[];
  links: PillarAudienceLink[];
  onLinkChange: (pillarId: string, audienceId: string, strength: number | null) => void;
}

// Shared utility functions for both mobile and desktop components
const getLinkStrength = (
  links: PillarAudienceLink[],
  pillarId: string, 
  audienceId: string
): number | null => {
  const link = links.find(l => l.pillarId === pillarId && l.audienceId === audienceId);
  return link ? link.relationshipStrength : null;
};

const getStrengthColor = (strength: number | null): string => {
  if (strength === null) return 'bg-gray-100 dark:bg-gray-800';
  if (strength >= 8) return 'bg-green-100 dark:bg-green-900';
  if (strength >= 4) return 'bg-yellow-100 dark:bg-yellow-900';
  return 'bg-red-100 dark:bg-red-900';
};

// Mobile implementation
const MobileMatrix: React.FC<PillarAudienceMatrixProps> = ({
  pillars,
  audiences,
  links,
  onLinkChange
}) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Content-Audience Relationships</CardTitle>
        <CardDescription>
          Define relationship strength between content pillars and audiences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {pillars.map(pillar => (
            <div key={pillar.id} className="border rounded-md p-3">
              <h3 className="font-medium mb-2">{pillar.name}</h3>
              <div className="space-y-2">
                {audiences.map(audience => {
                  const strength = getLinkStrength(links, pillar.id, audience.id);
                  return (
                    <div key={`${pillar.id}-${audience.id}`} className="flex items-center justify-between p-2 border-b">
                      <span className="text-sm">{audience.name}</span>
                      <Select
                        value={strength?.toString() || "none"}
                        onValueChange={(value) => {
                          const newStrength = value === "none" ? null : parseInt(value);
                          onLinkChange(pillar.id, audience.id, newStrength);
                        }}
                      >
                        <SelectTrigger className="w-24 bg-white dark:bg-gray-900">
                          <SelectValue placeholder="None" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="10">10 - Strongest</SelectItem>
                          <SelectItem value="9">9</SelectItem>
                          <SelectItem value="8">8</SelectItem>
                          <SelectItem value="7">7</SelectItem>
                          <SelectItem value="6">6</SelectItem>
                          <SelectItem value="5">5 - Medium</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="1">1 - Weakest</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Desktop implementation
const DesktopMatrix: React.FC<PillarAudienceMatrixProps> = ({
  pillars,
  audiences,
  links,
  onLinkChange
}) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Content-Audience Relationship Matrix</CardTitle>
        <CardDescription>
          Define how strongly each content pillar relates to each target audience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 border bg-muted text-left">Content Pillars</th>
                {audiences.map(audience => (
                  <th key={audience.id} className="p-2 border bg-muted text-center min-w-[150px]">
                    {audience.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pillars.map(pillar => (
                <tr key={pillar.id}>
                  <td className="p-2 border font-medium">{pillar.name}</td>
                  {audiences.map(audience => {
                    const strength = getLinkStrength(links, pillar.id, audience.id);
                    return (
                      <td 
                        key={`${pillar.id}-${audience.id}`} 
                        className={`p-2 border text-center ${getStrengthColor(strength)}`}
                      >
                        <Select
                          value={strength?.toString() || "none"}
                          onValueChange={(value) => {
                            const newStrength = value === "none" ? null : parseInt(value);
                            onLinkChange(pillar.id, audience.id, newStrength);
                          }}
                        >
                          <SelectTrigger className="w-24 mx-auto bg-white dark:bg-gray-900">
                            <SelectValue placeholder="None" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="10">10 - Strongest</SelectItem>
                            <SelectItem value="9">9</SelectItem>
                            <SelectItem value="8">8</SelectItem>
                            <SelectItem value="7">7</SelectItem>
                            <SelectItem value="6">6</SelectItem>
                            <SelectItem value="5">5 - Medium</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="1">1 - Weakest</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

// Create and export the responsive component
export const PillarAudienceMatrix = createResponsiveComponent<PillarAudienceMatrixProps>(
  DesktopMatrix,
  MobileMatrix
);
