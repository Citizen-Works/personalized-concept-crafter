
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ApiKeySettings = () => {
  const [claudeApiKey, setClaudeApiKey] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<'success' | 'error' | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const verifyClaudeApiKey = async () => {
    if (!claudeApiKey) {
      toast.error('Please enter an API key');
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-with-claude', {
        body: { 
          prompt: 'This is a test to verify the API key. Please respond with "success" if you can read this message.',
          contentType: 'test',
          apiKey: claudeApiKey 
        }
      });

      if (error) {
        throw error;
      }

      setVerificationResult('success');
      toast.success('API key verified successfully');
    } catch (error) {
      console.error('API key verification failed:', error);
      setVerificationResult('error');
      toast.error('API key verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const saveApiKeys = async () => {
    setIsSaving(true);
    try {
      // In a real implementation, this would save the API key to the server
      // For now, we'll just show a success message
      toast.success('API keys saved successfully');
    } catch (error) {
      console.error('Error saving API keys:', error);
      toast.error('Failed to save API keys');
    } finally {
      setIsSaving(false);
    }
  };

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
                value={claudeApiKey}
                onChange={(e) => setClaudeApiKey(e.target.value)}
                placeholder="sk-ant-xxxxx"
                className="flex-1"
              />
              <Button 
                variant="outline" 
                onClick={verifyClaudeApiKey} 
                disabled={isVerifying || !claudeApiKey}
              >
                {isVerifying ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : verificationResult === 'success' ? (
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                ) : verificationResult === 'error' ? (
                  <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                ) : null}
                Verify
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Get your Claude API key from{' '}
              <a 
                href="https://console.anthropic.com/settings/keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Anthropic Console
              </a>
            </p>
          </div>
          
          <div className="flex justify-end">
            <Button 
              className="gap-1" 
              onClick={saveApiKeys}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save API Keys
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeySettings;
