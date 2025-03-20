import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clipboard, Smartphone, Check, Info, ExternalLink } from 'lucide-react';
import { useWebhookConfig, WebhookService } from '@/hooks/useWebhookConfig';
import { useAuth } from '@/context/AuthContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const serviceIcons: Record<WebhookService, React.ReactNode> = {
  otter: <Smartphone className="h-5 w-5 text-blue-500" />,
  fathom: <Smartphone className="h-5 w-5 text-purple-500" />,
  read: <Smartphone className="h-5 w-5 text-green-500" />,
  fireflies: <Smartphone className="h-5 w-5 text-orange-500" />
};

const serviceNames: Record<WebhookService, string> = {
  otter: "Otter.ai",
  fathom: "Fathom",
  read: "Read.AI",
  fireflies: "Fireflies.ai"
};

const WebhookSettings = () => {
  const { user } = useAuth();
  const { 
    configurations, 
    isLoading, 
    getOrCreateWebhookUrl, 
    toggleServiceConnection, 
    copyWebhookUrl, 
    copying 
  } = useWebhookConfig();
  
  const [webhookUrl, setWebhookUrl] = useState<string>("");
  const [loadingUrl, setLoadingUrl] = useState(true);

  useEffect(() => {
    if (user) {
      setLoadingUrl(true);
      getOrCreateWebhookUrl("otter", {
        onSuccess: (url) => {
          setWebhookUrl(url);
          setLoadingUrl(false);
        },
        onError: () => {
          setLoadingUrl(false);
        }
      });
    }
  }, [user, getOrCreateWebhookUrl]);

  const getServiceStatus = (serviceName: WebhookService) => {
    const config = configurations.find(c => c.service_name === serviceName);
    return config?.is_active || false;
  };

  const getLastConnected = (serviceName: WebhookService) => {
    const config = configurations.find(c => c.service_name === serviceName);
    return config?.last_connected ? new Date(config.last_connected).toLocaleDateString() : null;
  };

  const getFullWebhookUrl = (token: string) => {
    return `${window.location.origin}/api/webhook/${token}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Webhook Integration</CardTitle>
          <CardDescription>Manage your webhook endpoints for meeting transcripts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Your Webhook URL</Label>
            <div className="flex gap-2">
              {loadingUrl ? (
                <Skeleton className="h-10 flex-1" />
              ) : (
                <Input 
                  id="webhook-url" 
                  readOnly
                  value={getFullWebhookUrl(webhookUrl)}
                  className="flex-1 font-mono text-sm"
                />
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      onClick={() => copyWebhookUrl(getFullWebhookUrl(webhookUrl))}
                      disabled={loadingUrl || copying}
                    >
                      {copying ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy webhook URL</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Use this URL to receive meeting transcripts from supported services
            </p>
          </div>
          
          <div className="space-y-2 mt-4">
            <div className="flex items-center justify-between">
              <Label>Supported Services</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Configure these services to send meeting transcripts to your webhook URL. Check each service's documentation for webhook setup instructions.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {Array(4).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-24" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {(Object.keys(serviceNames) as WebhookService[]).map((service) => (
                  <Card key={service} className="p-4 border">
                    <div className="flex items-center space-x-2">
                      {serviceIcons[service]}
                      <div>
                        <h4 className="text-sm font-medium">{serviceNames[service]}</h4>
                        <p className="text-xs text-muted-foreground">
                          {getServiceStatus(service) 
                            ? `Connected${getLastConnected(service) ? ` on ${getLastConnected(service)}` : ''}` 
                            : 'Not connected'}
                        </p>
                      </div>
                      <div className="ml-auto flex space-x-2">
                        <Button 
                          size="sm" 
                          variant={getServiceStatus(service) ? "default" : "outline"}
                          className={getServiceStatus(service) ? "bg-green-600 hover:bg-green-700" : ""}
                          onClick={() => toggleServiceConnection({ 
                            serviceName: service, 
                            isActive: !getServiceStatus(service) 
                          })}
                        >
                          {getServiceStatus(service) ? 'Connected' : 'Connect'}
                        </Button>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  const docsUrls: Record<WebhookService, string> = {
                                    otter: "https://otter.ai/help/webhooks",
                                    fathom: "https://fathom.video/help/webhooks",
                                    read: "https://read.ai/help/api-docs/webhooks",
                                    fireflies: "https://fireflies.ai/docs/api/webhooks"
                                  };
                                  window.open(docsUrls[service], '_blank');
                                }}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Setup instructions</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="text-sm font-medium mb-2">How to set up webhook integration</h4>
              <ol className="text-xs text-muted-foreground space-y-2 list-decimal pl-4">
                <li>Copy your unique webhook URL above</li>
                <li>Go to your meeting transcript service settings</li>
                <li>Find the webhooks or integrations section</li>
                <li>Paste your webhook URL and save the configuration</li>
                <li>After connecting, meeting transcripts will be automatically imported</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebhookSettings;
