// WebSocket functionality disabled for Netlify serverless deployment
// Using polling-based updates instead for real-time functionality

let ws: WebSocket | null = null;

export function connectWebSocket(): WebSocket | null {
  // WebSocket not supported in serverless environment
  // Real-time updates handled via polling in useRealTimeQueue hook
  console.log("WebSocket disabled - using polling for real-time updates");
  return null;
}

export function getWebSocket(): WebSocket | null {
  return null;
}
