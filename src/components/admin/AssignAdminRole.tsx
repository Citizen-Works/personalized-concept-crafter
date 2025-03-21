
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const AssignAdminRole: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleAssignAdmin = async () => {
    if (!user) {
      toast.error("You must be logged in to perform this action");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Use the service_role key (via a server endpoint) to bypass RLS
      // This is a temporary solution - in production, you should use a more secure approach
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
          Grant yourself admin privileges to access the admin dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Use this button to assign yourself the admin role. After clicking, you'll need to sign out and sign back in for changes to take effect.
        </p>
        <Button 
          variant="default" 
          onClick={handleAssignAdmin} 
          disabled={isLoading}
          className="gap-2"
        >
          <ShieldCheck className="h-4 w-4" />
          {isLoading ? "Assigning..." : "Make Me an Admin"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AssignAdminRole;
