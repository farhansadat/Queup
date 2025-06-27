import { useQuery } from "@tanstack/react-query";
import type { Queue } from "@shared/schema";

export function useRealTimeQueue(storeId?: string) {
  // Use polling for real-time updates in serverless environment
  const { data: queue = [], isLoading, error } = useQuery<Queue[]>({
    queryKey: [`/api/stores/${storeId}/queue`],
    enabled: !!storeId,
    refetchInterval: 5000, // Poll every 5 seconds for real-time updates
    refetchIntervalInBackground: true,
  });

  return { queue, isLoading, error, wsConnected: false };
}
