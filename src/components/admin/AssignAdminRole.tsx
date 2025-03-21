
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';
import { toast } from 'sonner';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AssignAdminRole: React.FC = () => {
  const { user, refreshAdminStatus, isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // This function is kept for historical reasons but is now disabled
  const handleAssignAdmin = async () => {
    if (!user) {
      toast.error("You must be logged in to perform this action");
      return;
    }
    
    setIsLoading(true);
    
    try {
      toast.error("Self-assigning admin privileges is not allowed for security reasons");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Admin Status</CardTitle>
          <CardDescription>
            You currently have admin privileges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-800">
            <ShieldCheck className="h-4 w-4 text-green-800 dark:text-green-500" />
            <AlertDescription className="text-green-800 dark:text-green-500">
              You already have admin privileges and can access the admin dashboard.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Admin Access</CardTitle>
        <CardDescription>
          Admin access information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4 bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-800">
          <AlertTriangle className="h-4 w-4 text-amber-800 dark:text-amber-500" />
          <AlertDescription className="text-amber-800 dark:text-amber-500">
            Self-assigning admin privileges has been disabled for security reasons. 
            Admin roles should be granted by an existing administrator through proper channels.
          </AlertDescription>
        </Alert>
        
        <p className="text-sm text-muted-foreground mb-4">
          Admin privileges can only be granted by an existing administrator. 
          Please contact your system administrator if you need admin access.
        </p>
        
        <Button 
          variant="outline" 
          disabled={true}
          className="gap-2 cursor-not-allowed opacity-50"
        >
          <ShieldCheck className="h-4 w-4" />
          Admin Access Restricted
        </Button>
      </CardContent>
    </Card>
  );
};

export default AssignAdminRole;
