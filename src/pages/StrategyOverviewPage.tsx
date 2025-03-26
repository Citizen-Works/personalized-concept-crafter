import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Compass, Target, Users, MessageSquareShare, FilePenLine, ChevronRight, Plus, GitMerge } from 'lucide-react';
import { useContentPillars } from '@/hooks/useContentPillars';
import { useTargetAudiences } from '@/hooks/useTargetAudiences';
import { useCallToActions } from '@/hooks/useCallToActions';
import { useWritingStyle } from '@/hooks/useWritingStyle';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

const StrategyOverviewPage = () => {
  const { contentPillars, isLoading: isPillarsLoading } = useContentPillars();
  const { targetAudiences, isLoading: isAudiencesLoading } = useTargetAudiences();
  const { callToActions, isLoading: isCtasLoading } = useCallToActions();
  const { profile, isLoading: isStyleLoading } = useWritingStyle();
  
  const isLoading = isPillarsLoading || isAudiencesLoading || isCtasLoading || isStyleLoading;
  
  // Calculate completion percentages
  const pillarsCompletion = contentPillars?.length > 0 ? 100 : 0;
  const audiencesCompletion = targetAudiences?.length > 0 ? 100 : 0;
  const ctasCompletion = callToActions?.length > 0 ? 100 : 0;
  
  // Writing style completion (based on filled fields)
  let writingStyleCompletion = 0;
  if (profile) {
    const fields = [
      profile.voiceAnalysis || profile.voice_analysis,
      profile.generalStyleGuide || profile.general_style_guide,
      profile.vocabularyPatterns || profile.vocabulary_patterns,
      profile.linkedinStyleGuide || profile.linkedin_style_guide,
      profile.newsletterStyleGuide || profile.newsletter_style_guide,
      profile.marketingStyleGuide || profile.marketing_style_guide
    ];
    
    const filledFields = fields.filter(field => field && field.trim().length > 0).length;
    writingStyleCompletion = Math.round((filledFields / fields.length) * 100);
  }
  
  // Overall strategy completion
  const overallCompletion = Math.round(
    (pillarsCompletion + audiencesCompletion + ctasCompletion + writingStyleCompletion) / 4
  );

  // Show audience mapping card if both pillars and audiences exist
  const showAudienceMapping = contentPillars?.length > 0 && targetAudiences?.length > 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Content Strategy</h1>
        <p className="text-muted-foreground">
          Define and manage your content strategy to create more effective content
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Compass className="mr-2 h-5 w-5" />
            Strategy Overview
          </CardTitle>
          <CardDescription>
            Your content strategy completeness
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Overall Strategy Completion</span>
                <span className="text-sm font-medium">{overallCompletion}%</span>
              </div>
              <Progress value={overallCompletion} className="h-2" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Content Pillars</span>
                    <span className="text-sm">{pillarsCompletion}%</span>
                  </div>
                  <Progress value={pillarsCompletion} className="h-1" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Target Audiences</span>
                    <span className="text-sm">{audiencesCompletion}%</span>
                  </div>
                  <Progress value={audiencesCompletion} className="h-1" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Call To Actions</span>
                    <span className="text-sm">{ctasCompletion}%</span>
                  </div>
                  <Progress value={ctasCompletion} className="h-1" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Writing Style</span>
                    <span className="text-sm">{writingStyleCompletion}%</span>
                  </div>
                  <Progress value={writingStyleCompletion} className="h-1" />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StrategyCard 
          title="Content Pillars"
          description="Define the core themes and topics for your content"
          icon={Target}
          count={contentPillars.length}
          isLoading={isPillarsLoading}
          href="/strategy/content-pillars"
        />
        
        <StrategyCard 
          title="Target Audiences"
          description="Define your ideal audience segments and their needs"
          icon={Users}
          count={targetAudiences.length}
          isLoading={isAudiencesLoading}
          href="/strategy/target-audiences"
        />
        
        <StrategyCard 
          title="Call To Actions"
          description="Create effective calls to action for your content"
          icon={MessageSquareShare}
          count={callToActions.length}
          isLoading={isCtasLoading}
          href="/strategy/call-to-actions"
        />
        
        <StrategyCard 
          title="Writing Style"
          description="Define your unique voice and tone for all platforms"
          icon={FilePenLine}
          count={writingStyleCompletion > 0 ? 1 : 0}
          isLoading={isStyleLoading}
          href="/strategy/writing-style"
        />

        {showAudienceMapping && (
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-xl flex items-center">
                  <GitMerge className="mr-2 h-5 w-5" />
                  Content-Audience Mapping
                </CardTitle>
                <CardDescription>
                  Map your content pillars to target audiences
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create relationships between your content pillars and target audiences to identify content opportunities and gaps.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link to="/strategy/audience-mapping">
                  View Audience Mapping
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Strategy Tips</CardTitle>
          <CardDescription>
            Quick tips to enhance your content strategy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start">
              <div className="rounded-full bg-primary/10 p-1 mr-2 mt-0.5">
                <ChevronRight className="h-3 w-3 text-primary" />
              </div>
              <span className="text-sm">Define 3-5 content pillars that align with your business goals and audience interests</span>
            </li>
            <li className="flex items-start">
              <div className="rounded-full bg-primary/10 p-1 mr-2 mt-0.5">
                <ChevronRight className="h-3 w-3 text-primary" />
              </div>
              <span className="text-sm">Create detailed audience profiles with pain points and goals for targeted content</span>
            </li>
            <li className="flex items-start">
              <div className="rounded-full bg-primary/10 p-1 mr-2 mt-0.5">
                <ChevronRight className="h-3 w-3 text-primary" />
              </div>
              <span className="text-sm">Develop a consistent brand voice and adapt it for different platforms</span>
            </li>
            <li className="flex items-start">
              <div className="rounded-full bg-primary/10 p-1 mr-2 mt-0.5">
                <ChevronRight className="h-3 w-3 text-primary" />
              </div>
              <span className="text-sm">Create compelling call-to-actions that guide your audience to the next step</span>
            </li>
            <li className="flex items-start">
              <div className="rounded-full bg-primary/10 p-1 mr-2 mt-0.5">
                <ChevronRight className="h-3 w-3 text-primary" />
              </div>
              <span className="text-sm">Regularly review your content strategy effectiveness and refine as needed</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

interface StrategyCardProps {
  title: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  count: number;
  isLoading: boolean;
  href: string;
}

const StrategyCard: React.FC<StrategyCardProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  count, 
  isLoading,
  href 
}) => {
  const isCallToActions = title === "Call To Actions";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl flex items-center">
            <Icon className="mr-2 h-5 w-5" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {isLoading ? (
          <Skeleton className="h-8 w-8 rounded-full" />
        ) : (
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
            {count}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-4 w-full mb-2" />
        ) : count === 0 ? (
          <p className="text-sm text-muted-foreground">
            No {title.toLowerCase()} defined yet. Add your first one to enhance your strategy.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            You have {count} {count === 1 ? title.toLowerCase() : title.toLowerCase()} defined.
          </p>
        )}
      </CardContent>
      <CardFooter>
        <div className="w-full flex justify-between">
          <Button asChild variant="outline">
            <Link to={href}>View {title}</Link>
          </Button>
          {isCallToActions ? (
            <Button asChild>
              <Link to={href} className="flex items-center">
                <Plus className="mr-1 h-4 w-4" />
                Add New
              </Link>
            </Button>
          ) : (
            <Button asChild>
              <Link to={`${href}/new`} className="flex items-center">
                <Plus className="mr-1 h-4 w-4" />
                Add New
              </Link>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default StrategyOverviewPage;

