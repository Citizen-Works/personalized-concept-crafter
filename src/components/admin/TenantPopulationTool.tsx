
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { populateTenantData } from '@/scripts/populateTenantData';
import { Loader2 } from 'lucide-react';

const TenantPopulationTool = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    success?: boolean;
    message?: string;
    error?: any;
  } | null>(null);

  const handlePopulateTenants = async () => {
    setIsLoading(true);
    setResults(null);
    
    try {
      const result = await populateTenantData();
      setResults(result);
    } catch (error) {
      setResults({
        success: false,
        error: error instanceof Error ? error.message : String(error)
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Tenant Data Population Tool</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          This tool will scan all users in the system, extract email domains, create tenant records for each domain, 
          and update user profiles with the appropriate tenant ID.
        </p>
        
        {results && (
          <Alert className="mb-4" variant={results.success ? "default" : "destructive"}>
            <AlertTitle>{results.success ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>
              {results.message || (results.error && JSON.stringify(results.error))}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handlePopulateTenants} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : "Populate Tenant Data"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TenantPopulationTool;
