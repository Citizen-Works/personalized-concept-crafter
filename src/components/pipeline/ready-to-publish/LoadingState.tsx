
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const LoadingState: React.FC = () => {
  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-6 w-16" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-24 w-full" />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Skeleton className="h-6 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-9" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
