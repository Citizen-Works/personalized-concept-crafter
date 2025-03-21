
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { RefreshCw, UserPlus, Send, Users } from 'lucide-react';
import { useErrorHandling } from '@/hooks/useErrorHandling';

// Interface for tenant information
interface TenantInfo {
  id: string;
  name: string;
  domain: string;
  userCount: number;
}

// Interface for user provisioning form data
interface UserProvisioningFormData {
  email: string;
  name: string;
  tenant: string;
  role: 'user' | 'admin' | 'editor';
  sendInvite: boolean;
}

interface UserProvisioningProps {
  isLoading?: boolean;
}

const UserProvisioning: React.FC<UserProvisioningProps> = ({ 
  isLoading = false
}) => {
  const { handleError } = useErrorHandling('UserProvisioning');
  
  // Mock data - in a real implementation, this would come from your backend
  const [tenants, setTenants] = useState<TenantInfo[]>([
    { id: '1', name: 'Acme Corp', domain: 'acme.com', userCount: 12 },
    { id: '2', name: 'Example Organization', domain: 'example.org', userCount: 8 },
    { id: '3', name: 'Startup Inc', domain: 'startup.co', userCount: 3 }
  ]);
  
  const [formData, setFormData] = useState<UserProvisioningFormData>({
    email: '',
    name: '',
    tenant: '',
    role: 'user',
    sendInvite: true
  });
  
  const [processing, setProcessing] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTenantChange = (value: string) => {
    setFormData(prev => ({ ...prev, tenant: value }));
    
    // Auto-populate email domain based on tenant selection
    const selectedTenant = tenants.find(t => t.id === value);
    if (selectedTenant && formData.email.indexOf('@') === -1) {
      // Only update domain if user hasn't entered a domain yet
      setFormData(prev => ({ 
        ...prev, 
        email: prev.email ? `${prev.email}@${selectedTenant.domain}` : '' 
      }));
    }
  };
  
  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value as 'user' | 'admin' | 'editor' }));
  };
  
  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, sendInvite: checked }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.email || !formData.name || !formData.tenant) {
      toast.error('Please fill all required fields');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setProcessing(true);
    
    try {
      // In a real implementation, this would call your backend API
      // to provision the user in the appropriate tenant
      console.log('Provisioning user:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update local state with new user count for the tenant
      setTenants(prev => prev.map(tenant => 
        tenant.id === formData.tenant 
          ? { ...tenant, userCount: tenant.userCount + 1 } 
          : tenant
      ));
      
      // Show success message
      toast.success(`User ${formData.name} (${formData.email}) provisioned successfully`);
      
      // Reset form
      setFormData({
        email: '',
        name: '',
        tenant: '',
        role: 'user',
        sendInvite: true
      });
    } catch (error) {
      handleError(error, 'provisioning user');
    } finally {
      setProcessing(false);
    }
  };
  
  const getTenantUsers = () => {
    try {
      // In a real implementation, this would fetch the latest tenant information
      toast.info('Refreshing tenant user counts...');
      
      // Simulate API call
      setTimeout(() => {
        // Simulate updated user counts
        setTenants(prev => prev.map(tenant => ({ 
          ...tenant, 
          userCount: Math.floor(Math.random() * 20) + 1 
        })));
        
        toast.success('Tenant user counts refreshed');
      }, 1000);
    } catch (error) {
      handleError(error, 'fetching tenant users');
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>User Provisioning</CardTitle>
              <CardDescription>
                Create and manage user accounts for your tenants
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={getTenantUsers}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tenant">Tenant Organization</Label>
              <Select value={formData.tenant} onValueChange={handleTenantChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tenant" />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map(tenant => (
                    <SelectItem key={tenant.id} value={tenant.id}>
                      {tenant.name} ({tenant.domain}) - {tenant.userCount} users
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">User Name</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="John Doe" 
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="john.doe@example.com" 
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">User Role</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="sendInvite" 
                checked={formData.sendInvite}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="sendInvite" className="text-sm cursor-pointer">
                Send invitation email
              </Label>
            </div>
            
            <Button 
              type="submit" 
              disabled={processing}
              className="w-full mt-4"
            >
              {processing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Provisioning...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Provision User
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Bulk Provisioning
          </CardTitle>
          <CardDescription>
            Provision multiple users at once using CSV import
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tenant-bulk">Tenant Organization</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select tenant" />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map(tenant => (
                    <SelectItem key={tenant.id} value={tenant.id}>
                      {tenant.name} ({tenant.domain})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="csv-file">CSV File</Label>
              <Input id="csv-file" type="file" accept=".csv" />
              <p className="text-xs text-muted-foreground mt-1">
                CSV format: name, email, role (user/editor/admin)
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">
            <Send className="h-4 w-4 mr-2" />
            Upload and Process
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserProvisioning;
