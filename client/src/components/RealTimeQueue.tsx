import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { connectWebSocket } from "@/lib/ws";
import type { Queue } from "@shared/schema";

interface RealTimeQueueProps {
  storeId: string;
  children: (data: { queue: Queue[], isLoading: boolean }) => React.ReactNode;
}

export function RealTimeQueue({ storeId, children }: RealTimeQueueProps) {
  const [wsConnected, setWsConnected] = useState(false);

  const { data: queue = [], isLoading } = useQuery<Queue[]>({
    queryKey: [`/api/stores/${storeId}/queue`],
    enabled: !!storeId,
    refetchInterval: wsConnected ? false : 5000, // Fallback polling if WS fails
  });

  useEffect(() => {
    if (!storeId) return;

    const ws = connectWebSocket();
    
    ws.onopen = () => {
      setWsConnected(true);
      // Subscribe to store updates
      ws.send(JSON.stringify({
        type: "subscribe",
        storeId: storeId
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "queue_update" && data.storeId === storeId) {
          // Invalidate and refetch queue data
          queryClient.invalidateQueries({ 
            queryKey: [`/api/stores/${storeId}/queue`] 
          });
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    };

    ws.onclose = () => {
      setWsConnected(false);
    };

    ws.onerror = () => {
      setWsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [storeId]);

  return <>{children({ queue, isLoading })}</>;
}
