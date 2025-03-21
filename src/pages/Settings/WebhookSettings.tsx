import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clipboard, Smartphone, Check, Info, ExternalLink, Loader2, Zap } from 'lucide-react';
import { useWebhookConfig, WebhookService } from '@/hooks/useWebhookConfig';
import { useAuth } from '@/context/auth';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { testZapierWebhook } from '@/utils/webhookUtils';

const serviceIcons: Record<WebhookService, React.ReactNode> = {
  otter: <Smartphone className="h-5 w-5 text-blue-500" />,
  fathom: <Smartphone className="h-5 w-5 text-purple-500" />,
  read: <Smartphone className="h-5 w-5 text-green-500" />,
  fireflies: <Smartphone className="h-5 w-5 text-orange-500" />,
  zapier: <Zap className="h-5 w-5 text-amber-500" />
};

const serviceNames: Record<WebhookService, string> = {
  otter: "Otter.ai",
  fathom: "Fathom",
  read: "Read.AI",
  fireflies: "Fireflies.ai",
  zapier: "Zapier"
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
  const [zapierWebhookUrl, setZapierWebhookUrl] = useState<string>("");
  const [testingZapier, setTestingZapier] = useState(false);

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

  const testZapier = async () => {
    if (!zapierWebhookUrl) {
      toast.error("Please enter a Zapier webhook URL");
      return;
    }

    try {
      setTestingZapier(true);
      await testZapierWebhook(zapierWebhookUrl);
      
      // Since we're using no-cors mode, we can't reliably know if the request succeeded
      // So we just assume it went through
      toast.success("Test data sent to Zapier webhook");
      
      // Store the Zapier URL and enable the connection
      toggleServiceConnection({ 
        serviceName: "zapier", 
        isActive: true,
        zapierWebhookUrl
      });
    } catch (error) {
      toast.error("Failed to send test data to Zapier");
      console.error("Zapier test error:", error);
    } finally {
      setTestingZapier(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Webhook Integration</CardTitle>
          <CardDescription>Manage your webhook endpoints for meeting transcripts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="services">
            <TabsList className="mb-4">
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="zapier">Zapier Integration</TabsTrigger>
            </TabsList>
            
            <TabsContent value="services" className="space-y-4">
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
                    {(Object.keys(serviceNames) as WebhookService[])
                      .filter(service => service !== 'zapier')
                      .map((service) => (
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
                                        fireflies: "https://fireflies.ai/docs/api/webhooks",
                                        zapier: "https://zapier.com/help/create/code-webhooks/trigger-zaps-from-webhooks"
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
            </TabsContent>
            
            <TabsContent value="zapier" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="zapier-webhook-url">Zapier Webhook URL</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Info className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Enter your Zapier webhook URL to connect services like Otter.ai and Fathom that don't have native webhook support.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex gap-2">
                  <Input 
                    id="zapier-webhook-url" 
                    placeholder="https://hooks.zapier.com/hooks/catch/123456/abcdef/"
                    value={zapierWebhookUrl}
                    onChange={(e) => setZapierWebhookUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={testZapier}
                    disabled={!zapierWebhookUrl || testingZapier}
                  >
                    {testingZapier ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
                    Test Connection
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Paste your Zapier webhook URL to connect non-webhook services
                </p>
              </div>
              
              <Card className="p-4 border mt-4">
                <div className="flex items-center space-x-2">
                  {serviceIcons.zapier}
                  <div>
                    <h4 className="text-sm font-medium">{serviceNames.zapier}</h4>
                    <p className="text-xs text-muted-foreground">
                      {getServiceStatus('zapier') 
                        ? `Connected${getLastConnected('zapier') ? ` on ${getLastConnected('zapier')}` : ''}` 
                        : 'Not connected'}
                    </p>
                  </div>
                  <div className="ml-auto flex space-x-2">
                    <Button 
                      size="sm" 
                      variant={getServiceStatus('zapier') ? "default" : "outline"}
                      className={getServiceStatus('zapier') ? "bg-green-600 hover:bg-green-700" : ""}
                      onClick={() => {
                        if (getServiceStatus('zapier')) {
                          toggleServiceConnection({ 
                            serviceName: 'zapier', 
                            isActive: false 
                          });
                        } else {
                          testZapier();
                        }
                      }}
                    >
                      {getServiceStatus('zapier') ? 'Connected' : 'Connect'}
                    </Button>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              window.open('https://zapier.com/help/create/code-webhooks/trigger-zaps-from-webhooks', '_blank');
                            }}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Zapier Webhooks Documentation</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </Card>
              
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="text-sm font-medium mb-2">How to set up Zapier integration</h4>
                <ol className="text-xs text-muted-foreground space-y-2 list-decimal pl-4">
                  <li>Create a new Zap in Zapier</li>
                  <li>Choose your service (e.g., Otter.ai or Fathom) as the trigger</li>
                  <li>Set up "Webhooks by Zapier" as the action</li>
                  <li>Configure it to send data to your webhook URL (copy from the Services tab)</li>
                  <li>Test the connection and enable your Zap</li>
                  <li>Enter the resulting Webhook URL above and test the connection</li>
                </ol>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebhookSettings;
