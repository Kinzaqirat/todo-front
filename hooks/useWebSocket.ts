import { useEffect, useRef, useState, useCallback } from 'react';

interface WebSocketMessage {
  type: string;
  data?: any;
  message?: string;
  connections?: number;
}

interface UseWebSocketOptions {
  onMessage?: (message: WebSocketMessage) => void;
  onTaskCreated?: (task: any) => void;
  onTaskUpdated?: (task: any) => void;
  onTaskDeleted?: (data: { id: number; title: string }) => void;
  onTaskCompleted?: (task: any) => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const {
    onMessage,
    onTaskCreated,
    onTaskUpdated,
    onTaskDeleted,
    onTaskCompleted,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [connectionCount, setConnectionCount] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getWebSocketUrl = useCallback(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    // Convert http(s) to ws(s)
    const wsUrl = apiUrl.replace(/^http/, 'ws');
    return `${wsUrl}/ws`;
  }, []);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    const url = getWebSocketUrl();
    console.log('Connecting to WebSocket:', url);

    try {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          console.log('WebSocket message:', message);

          // Update connection count from server
          if (message.type === 'connected' && message.connections) {
            setConnectionCount(message.connections);
          }

          // Call general message handler
          onMessage?.(message);

          // Call specific handlers based on event type
          switch (message.type) {
            case 'task.created':
              onTaskCreated?.(message.data);
              break;
            case 'task.updated':
              onTaskUpdated?.(message.data);
              break;
            case 'task.deleted':
              onTaskDeleted?.(message.data);
              break;
            case 'task.completed':
              onTaskCompleted?.(message.data);
              break;
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);
        wsRef.current = null;

        // Attempt to reconnect
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          console.log(`Reconnecting (attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`);
          reconnectTimeoutRef.current = setTimeout(connect, reconnectInterval);
        } else {
          console.log('Max reconnection attempts reached');
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
    }
  }, [getWebSocketUrl, onMessage, onTaskCreated, onTaskUpdated, onTaskDeleted, onTaskCompleted, reconnectInterval, maxReconnectAttempts]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    reconnectAttemptsRef.current = maxReconnectAttempts; // Prevent reconnection
    wsRef.current?.close();
  }, [maxReconnectAttempts]);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  const ping = useCallback(() => {
    sendMessage({ type: 'ping' });
  }, [sendMessage]);

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Keep-alive ping every 30 seconds
  useEffect(() => {
    if (!isConnected) return;

    const pingInterval = setInterval(ping, 30000);
    return () => clearInterval(pingInterval);
  }, [isConnected, ping]);

  return {
    isConnected,
    connectionCount,
    connect,
    disconnect,
    sendMessage,
    ping,
  };
}
