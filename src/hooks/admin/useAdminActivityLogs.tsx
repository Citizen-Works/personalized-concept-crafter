
import { useQuery } from '@tanstack/react-query';
import { 
  fetchAdminActivityLogs, 
  fetchAdminActivityLogsByEntity
} from '@/services/admin/activityLogService';

export function useAdminActivityLogs(limit = 50) {
  const { 
    data: activityLogs, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['adminActivityLogs', limit],
    queryFn: () => fetchAdminActivityLogs(limit),
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });

  return {
    activityLogs,
    isLoading,
    isError,
    error,
    refetch
  };
}

export function useEntityActivityLogs(entityType: string, entityId: string) {
  const { 
    data: activityLogs, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['entityActivityLogs', entityType, entityId],
    queryFn: () => fetchAdminActivityLogsByEntity(entityType, entityId),
    enabled: !!entityType && !!entityId,
  });

  return {
    activityLogs,
    isLoading,
    isError,
    error,
    refetch
  };
}
