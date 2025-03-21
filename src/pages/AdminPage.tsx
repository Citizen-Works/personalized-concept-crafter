
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ActivityLog, 
  AdminStats, 
  AssignAdminRole, 
  SystemHealth, 
  UserProvisioning, 
  WebhookTester,
  TenantManagement
} from "@/components/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth";
import { AlertCircle } from "lucide-react";

const AdminPage = () => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Admin Dashboard</CardTitle>
            <CardDescription>Loading...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You do not have permission to view this page.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center p-4 text-amber-800 bg-amber-50 rounded-md">
              <AlertCircle className="h-5 w-5 mr-2" />
              <p>Admin privileges are required to access this dashboard.</p>
            </div>
            <div className="mt-4">
              <AssignAdminRole />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
          <CardDescription>
            Manage system settings, users, and monitor application health
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="tenants">Tenants</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <AdminStats />
        </TabsContent>
        
        <TabsContent value="users">
          <UserProvisioning />
        </TabsContent>
        
        <TabsContent value="system">
          <SystemHealth />
        </TabsContent>
        
        <TabsContent value="tenants">
          <TenantManagement />
        </TabsContent>
        
        <TabsContent value="activity">
          <ActivityLog />
        </TabsContent>
        
        <TabsContent value="webhooks">
          <WebhookTester />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
