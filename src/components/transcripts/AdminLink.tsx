
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

const AdminLink: React.FC = () => {
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
