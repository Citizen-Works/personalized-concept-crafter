
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from 'lucide-react';

const ApiKeySettings = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>Manage your API keys for third-party services</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="claude-api-key">Claude API Key</Label>
            <div className="flex gap-2">
              <Input 
                id="claude-api-key" 
                type="password" 
                defaultValue="sk-xxxxxxxxxxxxxxxxxxxx" 
                className="flex-1"
              />
              <Button variant="outline">Verify</Button>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button className="gap-1">
              <Save className="h-4 w-4" />
              Save API Keys
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeySettings;
