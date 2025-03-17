
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save } from 'lucide-react';

const BusinessSettings = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>Update your business details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="business-name">Business Name</Label>
            <Input id="business-name" defaultValue="Acme Inc." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="business-description">Business Description</Label>
            <Textarea 
              id="business-description" 
              className="min-h-32 resize-none"
              defaultValue="Acme Inc. is a leading provider of innovative solutions for businesses of all sizes..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin-url">LinkedIn URL</Label>
            <Input id="linkedin-url" defaultValue="https://linkedin.com/company/acme" />
          </div>
          
          <div className="flex justify-end">
            <Button className="gap-1">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessSettings;
