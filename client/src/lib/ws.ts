let ws: WebSocket | null = null;

export function connectWebSocket(): WebSocket {
  if (ws && ws.readyState === WebSocket.OPEN) {
    return ws;
  }

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const wsUrl = `${protocol}//${window.location.hostname}:5001`;
  
  ws = new WebSocket(wsUrl);
  
  ws.onopen = () => {
    console.log("WebSocket connected");
  };

  ws.onclose = () => {
    console.log("WebSocket disconnected");
    // Attempt to reconnect after 3 seconds
    setTimeout(() => {
      if (ws?.readyState !== WebSocket.OPEN) {
        connectWebSocket();
      }
    }, 3000);
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  return ws;
}

export function getWebSocket(): WebSocket | null {
  return ws;
}
