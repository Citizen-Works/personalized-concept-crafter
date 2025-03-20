
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminStats } from '@/hooks/admin/useAdminStats';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpRight, Users, FileText, FileEdit, Send, UserPlus } from 'lucide-react';

const AdminStats: React.FC = () => {
  const { stats, isLoading } = useAdminStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-1" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      title: "Total Users",
      value: stats?.userCount || 0,
      description: "Active platform users",
      icon: <Users className="h-4 w-4" />,
      className: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
    },
    {
      title: "Content Ideas",
      value: stats?.contentIdeasCount || 0,
      description: "All content ideas",
      icon: <FileText className="h-4 w-4" />,
      className: "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
    },
    {
      title: "Drafts Created",
      value: stats?.draftsCount || 0,
      description: "Generated drafts",
      icon: <FileEdit className="h-4 w-4" />,
      className: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
    },
    {
      title: "Published Content",
      value: stats?.publishedCount || 0,
      description: "Ready to publish",
      icon: <Send className="h-4 w-4" />,
      className: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
    },
    {
      title: "Waitlist",
      value: stats?.waitlistCount || 0,
      description: "Pending registrations",
      icon: <UserPlus className="h-4 w-4" />,
      className: "bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {statItems.map((item, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <div className={`rounded-full p-1 ${item.className}`}>
              {item.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminStats;
