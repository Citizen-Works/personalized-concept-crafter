
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  AlertCircle,
  HomeIcon,
  FileText,
  Settings,
  ChevronRight,
  LayoutDashboardIcon
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from '@/components/ui/skeleton';
import AdminStats from '@/components/admin/AdminStats';
import ActivityLog from '@/components/admin/ActivityLog';
import SystemHealth from '@/components/admin/SystemHealth';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// This is a placeholder for future implementation
const NotImplementedSection: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="p-8 text-center">
      <AlertCircle className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
      <h3 className="text-xl font-medium mb-2">{title} Coming Soon</h3>
      <p className="text-muted-foreground max-w-md mx-auto">
        This section is currently under development. 
        It will be available in a future update.
      </p>
    </div>
  );
};

// Quick access cards for the dashboard
const QuickAccessCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  linkTo: string;
}> = ({ title, description, icon, linkTo }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="border rounded-lg p-4 cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-all duration-200"
      onClick={() => navigate(linkTo)}
    >
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-md bg-primary/10 text-primary">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

const AdminPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // This will be used in a real implementation to manage which section is expanded
  const quickAccessItems = [
    {
      title: "Landing Page Content",
      description: "Edit landing page sections and components",
      icon: <HomeIcon className="h-5 w-5" />,
      linkTo: "#landing-page"
    },
    {
      title: "Prompt Templates",
      description: "Edit AI prompts and response templates",
      icon: <FileText className="h-5 w-5" />,
      linkTo: "#prompt-templates"
    },
    {
      title: "System Configuration",
      description: "Manage API keys and system settings",
      icon: <Settings className="h-5 w-5" />,
      linkTo: "#system-config"
    }
  ];

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have permission to access the admin area. Please contact an administrator if you believe this is an error.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage system settings, content, and monitor platform activity
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="mb-2">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="landing-page">Landing Page</TabsTrigger>
          <TabsTrigger value="prompt-templates">Prompt Templates</TabsTrigger>
          <TabsTrigger value="system-config">System Config</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <AdminStats />
          
          <div className="grid gap-6 md:grid-cols-3">
            <ActivityLog />
            <SystemHealth />
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {quickAccessItems.map((item, index) => (
                <QuickAccessCard
                  key={index}
                  title={item.title}
                  description={item.description}
                  icon={item.icon}
                  linkTo={item.linkTo}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="landing-page">
          <NotImplementedSection title="Landing Page Editor" />
        </TabsContent>

        <TabsContent value="prompt-templates">
          <NotImplementedSection title="Prompt Template Manager" />
        </TabsContent>

        <TabsContent value="system-config">
          <NotImplementedSection title="System Configuration" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
