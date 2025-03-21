import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { useAuth } from '@/context/auth';

const AdminLink: React.FC = () => {
  const { isAdmin } = useAuth();
  
  // Only render the admin link if the user is an admin
  if (!isAdmin) {
    return null;
  }
  
  return (
    <Button variant="outline" asChild className="ml-auto">
      <Link to="/admin">
        <ShieldCheck className="h-4 w-4 mr-2" />
        Admin
      </Link>
    </Button>
  );
};

export default AdminLink;
