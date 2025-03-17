
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Smartphone } from 'lucide-react';

const WebhookSettings = () => {
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
              <Input 
                id="webhook-url" 
                readOnly
                defaultValue="https://api.contentengine.io/webhooks/transcripts/abcd1234"
                className="flex-1"
              />
              <Button variant="outline">Copy</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Use this URL to receive meeting transcripts from supported services
            </p>
          </div>
          
          <div className="space-y-2 mt-4">
            <Label>Supported Services</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <Card className="p-4 border-dashed">
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-5 w-5" />
                  <div>
                    <h4 className="text-sm font-medium">Otter.ai</h4>
                    <p className="text-xs text-muted-foreground">Not connected</p>
                  </div>
                  <Button size="sm" variant="outline" className="ml-auto">
                    Connect
                  </Button>
                </div>
              </Card>
              
              <Card className="p-4 border-dashed">
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-5 w-5" />
                  <div>
                    <h4 className="text-sm font-medium">Fathom</h4>
                    <p className="text-xs text-muted-foreground">Not connected</p>
                  </div>
                  <Button size="sm" variant="outline" className="ml-auto">
                    Connect
                  </Button>
                </div>
              </Card>
              
              <Card className="p-4 border-dashed">
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-5 w-5" />
                  <div>
                    <h4 className="text-sm font-medium">Read.AI</h4>
                    <p className="text-xs text-muted-foreground">Not connected</p>
                  </div>
                  <Button size="sm" variant="outline" className="ml-auto">
                    Connect
                  </Button>
                </div>
              </Card>
              
              <Card className="p-4 border-dashed">
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-5 w-5" />
                  <div>
                    <h4 className="text-sm font-medium">Fireflies.ai</h4>
                    <p className="text-xs text-muted-foreground">Not connected</p>
                  </div>
                  <Button size="sm" variant="outline" className="ml-auto">
                    Connect
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebhookSettings;
