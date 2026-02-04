import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { clientApi } from '../app/api/clientApi';

interface UseWebSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  emit: (event: string, data?: unknown) => void;
}

export function useWebSocket(): UseWebSocketReturn {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Prevent duplicate connections
    if (socketRef.current) {
      console.log('WebSocket already connected, reusing existing connection');
      return;
    }

    const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:3000';
    console.log('Creating WebSocket connection to', wsUrl);
    
    const newSocket = io(wsUrl, {
      auth: { token },
      transports: ['websocket', 'polling'], // Try websocket first, fallback to polling
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    newSocket.on('connect', () => {
      console.log('WebSocket connected, socket ID:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected, reason:', reason);
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error.message);
      setIsConnected(false);
    });

    // Handle server events
    newSocket.on('client:config-update', () => {
      console.log('Config update received, invalidating cache');
      dispatch(clientApi.util.invalidateTags(['Config']));
    });

    newSocket.on('client:sequence-update', (data) => {
      console.log('Sequence update received, forcing immediate refetch', data);
      // Invalidate and refetch immediately
      dispatch(clientApi.util.invalidateTags(['Sequence']));
      // Force an immediate refetch by resetting the entire API state for Sequence
      dispatch(clientApi.endpoints.getSequence.initiate(undefined, { 
        subscribe: false, 
        forceRefetch: true 
      }));
    });

    newSocket.on('client:force-refresh', () => {
      console.log('Force refresh command received, reloading page...');
      window.location.reload();
    });

    newSocket.on('client:command', (data: { command: string; data?: unknown }) => {
      console.log('Command received:', data);
      // Handle other commands as needed
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      console.log('Cleaning up WebSocket connection');
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [token, dispatch]);

  const emit = useCallback(
    (event: string, data?: unknown) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit(event, data);
      }
    },
    []
  );

  return {
    socket,
    isConnected,
    emit,
  };
}
