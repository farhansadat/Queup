import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { connectWebSocket } from "@/lib/ws";
import type { Queue } from "@shared/schema";

export function useRealTimeQueue(storeId?: string) {
  const [wsConnected, setWsConnected] = useState(false);

  const { data: queue = [], isLoading, error } = useQuery<Queue[]>({
    queryKey: [`/api/stores/${storeId}/queue`],
    enabled: !!storeId,
    refetchInterval: wsConnected ? false : 10000, // Fallback polling if WS fails
  });

  useEffect(() => {
    if (!storeId) return;

    const ws = connectWebSocket();
    
    const handleOpen = () => {
      setWsConnected(true);
      // Subscribe to store updates
      ws.send(JSON.stringify({
        type: "subscribe",
        storeId: storeId
      }));
    };

    const handleMessage = (event: MessageEvent) => {
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

    const handleClose = () => {
      setWsConnected(false);
    };

    const handleError = () => {
      setWsConnected(false);
    };

    // Add event listeners
    ws.addEventListener("open", handleOpen);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", handleClose);
    ws.addEventListener("error", handleError);

    // If already connected, subscribe immediately
    if (ws.readyState === WebSocket.OPEN) {
      handleOpen();
    }

    return () => {
      // Remove event listeners
      ws.removeEventListener("open", handleOpen);
      ws.removeEventListener("message", handleMessage);
      ws.removeEventListener("close", handleClose);
      ws.removeEventListener("error", handleError);
    };
  }, [storeId]);

  return { queue, isLoading, error, wsConnected };
}
