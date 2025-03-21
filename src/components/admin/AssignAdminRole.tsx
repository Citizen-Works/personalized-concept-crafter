
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { ShieldCheck, LockKeyhole } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// List of authorized email addresses that can become admins
// In a production app, this would be stored in the database or environment variables
const AUTHORIZED_ADMIN_EMAILS = [
  // Add your email here to allow only yourself to become admin
];

const AssignAdminRole: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [securityCode, setSecurityCode] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  // The security code would typically be a secret code only shared with authorized users
  // For this demo, we'll use "admin123" as an example
  const ADMIN_SECURITY_CODE = "admin123";
  
  useEffect(() => {
    // Check if the current user is authorized to become an admin
    if (user) {
      const isAuthorizedEmail = AUTHORIZED_ADMIN_EMAILS.includes(user.email || '');
      setIsAuthorized(isAuthorizedEmail || isAdmin);
    }
  }, [user, isAdmin]);
  
  const handleAssignAdmin = async () => {
    if (!user) {
      toast.error("You must be logged in to perform this action");
      return;
    }
    
    // Verify security code if the user is not pre-authorized
    if (!isAuthorized && securityCode !== ADMIN_SECURITY_CODE) {
      toast.error("Invalid security code");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Insert a row into the user_roles table
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: user.id, role: 'admin' })
        .single();
      
      if (error) {
        if (error.code === '23505') { // Unique violation error code
          toast.info("You already have admin privileges");
        } else {
          toast.error(`Error assigning admin role: ${error.message}`);
          console.error("Error:", error);
        }
      } else {
        toast.success("Admin role assigned successfully. Please sign out and sign back in for changes to take effect.");
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      toast.error("An unexpected error occurred while assigning admin role");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Admin Access</CardTitle>
        <CardDescription>
          Admin privileges are required to access the admin dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground mb-2">
          {isAuthorized 
            ? "You are authorized to become an admin. After clicking the button, you'll need to sign out and sign back in for changes to take effect."
            : "Admin access requires authorization. Please enter the security code to proceed."}
        </p>
        
        {!isAuthorized && (
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Enter security code"
              value={securityCode}
              onChange={(e) => setSecurityCode(e.target.value)}
            />
          </div>
        )}
        
        <Button 
          variant="default" 
          onClick={handleAssignAdmin} 
          disabled={isLoading || (!isAuthorized && !securityCode)}
          className="gap-2"
        >
          {isAuthorized ? <ShieldCheck className="h-4 w-4" /> : <LockKeyhole className="h-4 w-4" />}
          {isLoading ? "Assigning..." : "Make Me an Admin"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AssignAdminRole;
