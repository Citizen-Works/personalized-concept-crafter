
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, LogOut } from 'lucide-react';
import { useAuth } from '@/context/auth';
import { toast } from 'sonner';
import AssignAdminRole from '@/components/admin/AssignAdminRole';
import { useProfile } from '@/hooks/useProfile';

const ProfileSettings = () => {
  const { logout, isAdmin } = useAuth();
  const { profile, isLoading, saveProfile, isSaving } = useProfile();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (profile && !isLoading) {
      setName(profile.name || '');
      setEmail(profile.email || '');
      setJobTitle(profile.jobTitle || '');
    }
  }, [profile, isLoading]);

  const handleSaveProfile = async () => {
    await saveProfile({ 
      name, 
      jobTitle,
    });
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      // No need to navigate here as the AuthContext will handle it
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* User Actions Card */}
      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
          <CardDescription>Manage your account session</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="destructive" 
            className="gap-1" 
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut className="h-4 w-4" />
            {isLoggingOut ? 'Logging out...' : 'Sign Out'}
          </Button>
        </CardContent>
      </Card>

      {/* Personal Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                disabled 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input 
                id="jobTitle" 
                value={jobTitle} 
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Marketing Director, CEO, Consultant" 
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              className="gap-1" 
              onClick={handleSaveProfile}
              disabled={isSaving}
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
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
      
      {/* Only render the AssignAdminRole component if the user is an admin */}
      {isAdmin && <AssignAdminRole />}
    </div>
  );
};

export default ProfileSettings;
