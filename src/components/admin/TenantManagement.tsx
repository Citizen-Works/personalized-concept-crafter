
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/auth';
import TenantPopulationTool from './TenantPopulationTool';

const TenantManagement = () => {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tenant Management</CardTitle>
          <CardDescription>Admin access required</CardDescription>
        </CardHeader>
        <CardContent>
          <p>You need administrator privileges to access tenant management.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Tenant Management</h2>
        <p className="text-muted-foreground">Manage multi-tenant configuration and settings</p>
      </div>

      <Tabs defaultValue="tenants">
        <TabsList>
          <TabsTrigger value="tenants">Tenants</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tenants">
          <Card>
            <CardHeader>
              <CardTitle>Tenant List</CardTitle>
              <CardDescription>All registered tenants in the system</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Tenant list will be implemented here */}
              <p className="text-sm text-muted-foreground">
                Tenant list functionality coming soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tools">
          <TenantPopulationTool />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TenantManagement;
