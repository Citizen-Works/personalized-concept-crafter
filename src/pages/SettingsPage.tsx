
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, 
  Building, 
  Key, 
  Webhook, 
  Save,
  Smartphone,
  Bell
} from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application settings
        </p>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="profile" className="gap-1">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="business" className="gap-1">
            <Building className="h-4 w-4" />
            Business
          </TabsTrigger>
          <TabsTrigger value="api" className="gap-1">
            <Key className="h-4 w-4" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="gap-1">
            <Webhook className="h-4 w-4" />
            Webhooks
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john@example.com" />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button className="gap-1">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div></div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button className="gap-1">
                  <Save className="h-4 w-4" />
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Update your business details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="business-name">Business Name</Label>
                <Input id="business-name" defaultValue="Acme Inc." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business-description">Business Description</Label>
                <Textarea 
                  id="business-description" 
                  className="min-h-32 resize-none"
                  defaultValue="Acme Inc. is a leading provider of innovative solutions for businesses of all sizes..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin-url">LinkedIn URL</Label>
                <Input id="linkedin-url" defaultValue="https://linkedin.com/company/acme" />
              </div>
              
              <div className="flex justify-end">
                <Button className="gap-1">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage your API keys for third-party services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="claude-api-key">Claude API Key</Label>
                <div className="flex gap-2">
                  <Input 
                    id="claude-api-key" 
                    type="password" 
                    defaultValue="sk-xxxxxxxxxxxxxxxxxxxx" 
                    className="flex-1"
                  />
                  <Button variant="outline">Verify</Button>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button className="gap-1">
                  <Save className="h-4 w-4" />
                  Save API Keys
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="webhooks" className="space-y-6">
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
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Coming soon: Customize your notification preferences for content generation, approvals, and more.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
