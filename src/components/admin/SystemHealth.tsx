
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle, AlertTriangle, XCircle, BarChart } from 'lucide-react';

interface SystemHealthProps {
  checkSystem?: () => void;
  isLoading?: boolean;
}

interface HealthIndicatorProps {
  name: string;
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  details?: string;
}

const HealthIndicator: React.FC<HealthIndicatorProps> = ({ name, status, details }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <BarChart className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'warning':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center">
        {getStatusIcon()}
        <span className="ml-2 text-sm font-medium">{name}</span>
      </div>
      <div className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor()}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    </div>
  );
};

const UsageMetric: React.FC<{ label: string; value: number; max: number }> = ({ 
  label, 
  value, 
  max 
}) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  
  let className = "bg-green-600";
  if (percentage > 80) className = "bg-red-600";
  else if (percentage > 60) className = "bg-amber-500";
  
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <p className="text-muted-foreground">{label}</p>
        <p className="font-medium">{value} / {max}</p>
      </div>
      <Progress value={percentage} className="h-2" indicatorClassName={className} />
    </div>
  );
};

const SystemHealth: React.FC<SystemHealthProps> = ({ 
  checkSystem = () => {}, 
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-9 w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>System Health</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={checkSystem}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <CardDescription>
          Current system status and resource usage
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Services</h4>
            <HealthIndicator name="Database" status="healthy" />
            <HealthIndicator name="API Service" status="healthy" />
            <HealthIndicator name="Claude API" status="healthy" />
            <HealthIndicator name="Storage" status="healthy" />
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Resource Usage</h4>
            <UsageMetric label="Database Storage" value={1.2} max={20} />
            <UsageMetric label="API Requests" value={4750} max={10000} />
            <UsageMetric label="Storage Usage" value={0.8} max={5} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemHealth;
