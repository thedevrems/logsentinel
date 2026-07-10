import { useEffect, useRef, useState } from 'react';

// Opens a WebSocket, subscribes to channels and dispatches typed messages.
export function useWebSocket(channels, onMessage) {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const url = `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws`;
    const socket = new WebSocket(url);
    socketRef.current = socket;
    socket.onopen = () => {
      setConnected(true);
      channels.forEach((channel) => socket.send(JSON.stringify({ action: 'subscribe', channel })));
    };
    socket.onclose = () => setConnected(false);
    socket.onmessage = (event) => onMessage(JSON.parse(event.data));
    return () => socket.close();
  }, []);

  return { connected };
}
