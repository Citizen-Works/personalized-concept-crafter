
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDate, getActionBadge, getEntityName, getInitials } from './utils';
import { AdminActivityLog } from '@/services/admin/activityLogService';

interface ActivityLogTableProps {
  activityLogs: AdminActivityLog[] | undefined;
}

export const ActivityLogTable: React.FC<ActivityLogTableProps> = ({ activityLogs }) => {
  return (
    <ScrollArea className="h-[300px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Entity</TableHead>
            <TableHead>Time</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activityLogs?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                No admin activity has been logged yet
              </TableCell>
            </TableRow>
          ) : (
            activityLogs?.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {getInitials(log.user?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm truncate max-w-[120px]">
                      {log.user?.name || 'Unknown'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`${getActionBadge(log.action)} capitalize`}>
                    {log.action}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm truncate max-w-[120px]">
                    {getEntityName(log.entity_type)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(log.created_at)}
                  </span>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};
