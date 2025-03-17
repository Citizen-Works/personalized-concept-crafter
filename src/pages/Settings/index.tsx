
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Building, 
  Key, 
  Webhook, 
  Bell
} from 'lucide-react';

import ProfileSettings from './ProfileSettings';
import BusinessSettings from './BusinessSettings';
import ApiKeySettings from './ApiKeySettings';
import WebhookSettings from './WebhookSettings';
import NotificationSettings from './NotificationSettings';

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
        
        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>
        
        <TabsContent value="business">
          <BusinessSettings />
        </TabsContent>
        
        <TabsContent value="api">
          <ApiKeySettings />
        </TabsContent>
        
        <TabsContent value="webhooks">
          <WebhookSettings />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
