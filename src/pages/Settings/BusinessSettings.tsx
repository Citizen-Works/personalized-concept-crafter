import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save } from 'lucide-react';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { fetchUserProfile } from '@/services/profile/userProfileService';

const BusinessSettings = () => {
  const { user } = useAuth();
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const profile = await fetchUserProfile(user.id);
      if (profile) {
        setBusinessName(profile.businessName || '');
        setBusinessDescription(profile.businessDescription || '');
        setLinkedinUrl(profile.linkedinUrl || '');
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          business_name: businessName,
          business_description: businessDescription,
          linkedin_url: linkedinUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast.success('Business information saved successfully');
    } catch (error) {
      console.error('Error saving business settings:', error);
      toast.error('Failed to save business information');
    } finally {
      setIsLoading(false);
    }
  };

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
            <Input 
              id="business-name" 
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Enter your business name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="business-description">Business Description</Label>
            <Textarea 
              id="business-description" 
              className="min-h-32 resize-none"
              value={businessDescription}
              onChange={(e) => setBusinessDescription(e.target.value)}
              placeholder="Describe your business and its key offerings"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin-url">LinkedIn URL</Label>
            <Input 
              id="linkedin-url" 
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/company/your-business"
            />
          </div>
          
          <div className="flex justify-end">
            <Button 
              className="gap-1" 
              onClick={handleSaveChanges} 
              disabled={isLoading}
            >
              <Save className="h-4 w-4" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessSettings;
