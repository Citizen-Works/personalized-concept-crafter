
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';
import { useErrorHandling } from '@/hooks/useErrorHandling';

interface Tenant {
  id: string;
  name: string;
  domain: string;
  is_active: boolean;
  created_at: string;
}

const TenantManagement = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', domain: '', is_active: true });
  const [editingId, setEditingId] = useState<string | null>(null);
  const { isAdmin } = useAuth();
  const { handleError } = useErrorHandling('TenantManagement');

  const fetchTenants = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setTenants(data || []);
    } catch (error) {
      handleError(error, 'fetching tenants');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchTenants();
    }
  }, [isAdmin]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update existing tenant
        const { error } = await supabase
          .from('tenants')
          .update({
            name: formData.name,
            domain: formData.domain,
            is_active: formData.is_active
          })
          .eq('id', editingId);
        
        if (error) throw error;
        toast.success('Tenant updated successfully');
      } else {
        // Create new tenant
        const { error } = await supabase
          .from('tenants')
          .insert([{
            name: formData.name,
            domain: formData.domain,
            is_active: formData.is_active
          }]);
        
        if (error) throw error;
        toast.success('Tenant created successfully');
      }
      
      setIsDialogOpen(false);
      fetchTenants();
    } catch (error) {
      handleError(error, editingId ? 'updating tenant' : 'creating tenant');
    }
  };

  const handleEdit = (tenant: Tenant) => {
    setFormData({
      name: tenant.name,
      domain: tenant.domain,
      is_active: tenant.is_active
    });
    setEditingId(tenant.id);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tenant? This action cannot be undone.')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('tenants')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success('Tenant deleted successfully');
      fetchTenants();
    } catch (error) {
      handleError(error, 'deleting tenant');
    }
  };

  const handleAddNew = () => {
    setFormData({ name: '', domain: '', is_active: true });
    setEditingId(null);
    setIsDialogOpen(true);
  };

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Restricted</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-amber-600 dark:text-amber-400">
            <AlertCircle className="h-5 w-5 mr-2" />
            <p>You need administrator privileges to access tenant management.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Tenant Management</CardTitle>
        <Button onClick={handleAddNew} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Tenant
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-6 text-center text-muted-foreground">Loading tenants...</div>
        ) : tenants.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground">
            No tenants found. Add your first tenant to get started.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell className="font-medium">{tenant.name}</TableCell>
                  <TableCell>{tenant.domain}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      tenant.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {tenant.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(tenant.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(tenant)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(tenant.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Tenant' : 'Add New Tenant'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="domain" className="text-right">
                    Domain
                  </Label>
                  <Input
                    id="domain"
                    name="domain"
                    value={formData.domain}
                    onChange={handleInputChange}
                    required
                    className="col-span-3"
                    placeholder="example.com"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="is_active" className="text-right">
                    Active
                  </Label>
                  <div className="flex items-center space-x-2 col-span-3">
                    <Switch
                      id="is_active"
                      name="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active" className="font-normal">
                      {formData.is_active ? 'Active' : 'Inactive'}
                    </Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingId ? 'Update' : 'Create'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default TenantManagement;
