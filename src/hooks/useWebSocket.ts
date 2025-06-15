import { useState, useEffect, useRef, useCallback } from 'react';
import { WebSocketMessage } from '@shared/types';

export interface UseWebSocketReturn {
  socket: WebSocket | null;
  connectionStatus: 'Connecting' | 'Open' | 'Closing' | 'Closed';
  lastMessage: WebSocketMessage | null;
  sendMessage: (message: Record<string, unknown>) => void;
  connect: () => void;
  disconnect: () => void;
  messages: WebSocketMessage[];
}

export const useWebSocket = (url: string): UseWebSocketReturn => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'Connecting' | 'Open' | 'Closing' | 'Closed'>('Closed');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setConnectionStatus('Open');
        setSocket(ws);
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          console.log('Received message:', message);
          setLastMessage(message);
          setMessages(prev => [...prev, message]);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setConnectionStatus('Closed');
        setSocket(null);
        
        // Auto-reconnect after 3 seconds if not a manual disconnect
        if (event.code !== 1000) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('Attempting to reconnect...');
            connect();
          }, 3000);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('Closed');
      };

      setConnectionStatus('Connecting');
      
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionStatus('Closed');
    }
  }, [url]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (socket && socket.readyState === WebSocket.OPEN) {
      setConnectionStatus('Closing');
      socket.close(1000, 'Manual disconnect');
    }
  }, [socket]);

  const sendMessage = useCallback((message: Record<string, unknown>) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const messageString = typeof message === 'string' ? message : JSON.stringify(message);
      socket.send(messageString);
      console.log('Sent message:', message);
    } else {
      console.warn('WebSocket is not connected. Cannot send message:', message);
    }
  }, [socket]);

  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  return {
    socket,
    connectionStatus,
    lastMessage,
    sendMessage,
    connect,
    disconnect,
    messages
  };
}; 