import { WebSocketServer } from 'ws';
import { logger } from '../lib/logger.js';

// Broadcasts a JSON envelope to every client subscribed to the given channel.
function broadcast(clients, channel, type, payload) {
  const message = JSON.stringify({ channel, type, payload, ts: Date.now() });
  for (const client of clients) {
    if (client.readyState === 1 && client.channels.has(channel)) {
      client.send(message);
    }
  }
}

// Applies a subscribe/unsubscribe control message coming from a client.
function handleControl(socket, raw) {
  try {
    const msg = JSON.parse(raw.toString());
    if (msg.action === 'subscribe' && msg.channel) socket.channels.add(msg.channel);
    if (msg.action === 'unsubscribe' && msg.channel) socket.channels.delete(msg.channel);
  } catch {
    logger.warn('Received malformed websocket control message');
  }
}

// Creates a channel-based WebSocket hub bound to an existing HTTP server.
export function createWsHub(httpServer) {
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  wss.on('connection', (socket) => {
    socket.channels = new Set();
    socket.on('message', (raw) => handleControl(socket, raw));
    socket.on('error', () => socket.terminate());
  });
  return {
    emit: (channel, type, payload) => broadcast(wss.clients, channel, type, payload),
    clientCount: () => wss.clients.size,
  };
}
