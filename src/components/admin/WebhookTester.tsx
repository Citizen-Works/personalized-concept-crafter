import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { testWebhookFlow } from '@/services/webhooks/transcriptWebhookService';
import { useAuth } from '@/context/auth';
import { Loader2, TestTube } from 'lucide-react';

const WebhookTester: React.FC = () => {
  const { user } = useAuth();
  const [isTesting, setIsTesting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; documentId?: string } | null>(null);
  
  const handleTest = async () => {
    if (!user) return;
    
    setIsTesting(true);
    setResult(null);
    
    try {
      const testResult = await testWebhookFlow(user.id);
      setResult(testResult);
    } catch (error) {
      console.error("Error testing webhook flow:", error);
      setResult({
        success: false,
        message: "Unexpected error testing webhook flow"
      });
    } finally {
      setIsTesting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Webhook Testing</CardTitle>
        <CardDescription>
          Test the flow from webhook to transcript processing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          This will simulate a webhook call with a sample transcript and process it to generate content ideas.
        </p>
        
        {result && (
          <div className={`p-4 rounded-md text-sm ${result.success ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
            <p className="font-medium">{result.success ? 'Success' : 'Error'}</p>
            <p>{result.message}</p>
            {result.documentId && (
              <p className="mt-2">Document ID: {result.documentId}</p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="default" 
          onClick={handleTest} 
          disabled={isTesting}
          className="gap-2"
        >
          {isTesting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <TestTube className="h-4 w-4" />
              Test Webhook Flow
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WebhookTester;
