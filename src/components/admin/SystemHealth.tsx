
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface SystemMetric {
  name: string;
  status: 'healthy' | 'warning' | 'error';
  value: number;
  description: string;
}

const SystemHealth: React.FC = () => {
  // In a real application, these would be fetched from an API
  const metrics: SystemMetric[] = [
    {
      name: "API Health",
      status: "healthy",
      value: 100,
      description: "All API endpoints responding normally"
    },
    {
      name: "Database",
      status: "healthy",
      value: 100,
      description: "Connection pool and query performance optimal"
    },
    {
      name: "Claude API",
      status: "healthy",
      value: 100,
      description: "Authentication and requests functioning normally"
    },
    {
      name: "Storage",
      status: "healthy",
      value: 20,
      description: "20% of allocated storage used"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getProgressColor = (status: string, value: number) => {
    if (status === 'error') return 'bg-red-500';
    if (status === 'warning') return 'bg-amber-500';
    if (status === 'healthy') {
      // For storage, we want to show different colors based on usage
      if (value > 90) return 'bg-red-500';
      if (value > 70) return 'bg-amber-500';
      return 'bg-green-500';
    }
    return 'bg-gray-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Health</CardTitle>
        <CardDescription>
          Current status of key system components
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric) => (
            <div key={metric.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {getStatusIcon(metric.status)}
                  <span className="font-medium">{metric.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{metric.value}%</span>
              </div>
              <Progress 
                value={metric.value} 
                className="h-2"
                indicatorClassName={getProgressColor(metric.status, metric.value)}
              />
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemHealth;
