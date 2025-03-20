
import { useQuery } from '@tanstack/react-query';
import { fetchAdminStats } from '@/services/admin/statsService';

export function useAdminStats() {
  const { 
    data: stats, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['adminStats'],
    queryFn: fetchAdminStats,
    refetchInterval: 60 * 1000, // Refetch every minute
  });

  return {
    stats,
    isLoading,
    isError,
    error,
    refetch
  };
}
