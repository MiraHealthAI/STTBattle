import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';
import * as dotenv from 'dotenv';
import { WebSocketMessage } from '@shared/types';
import express from 'express';
import cors from 'cors';
import { sttModels } from './models';
import type { Request, Response } from 'express';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 8080;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Create HTTP server
const server = createServer();

// Create WebSocket server
const wss = new WebSocketServer({ 
  server
});

// Store connected clients
const clients = new Set<WebSocket>();

// WebSocket connection handler
wss.on('connection', (ws: WebSocket, request) => {
  // Basic origin check for security (optional)
  const origin = request.headers.origin;
  if (origin && !origin.includes('localhost') && !origin.includes(FRONTEND_URL)) {
    ws.close(1008, 'Origin not allowed');
    return;
  }
  
  clients.add(ws);

  // Send welcome message
  const welcomeMessage: WebSocketMessage = {
    type: 'welcome',
    message: 'Connected to STT Battle WebSocket server',
    timestamp: new Date().toISOString()
  };
  ws.send(JSON.stringify(welcomeMessage));

  // Handle incoming messages
  ws.on('message', (data: Buffer) => {
    try {
      const message = JSON.parse(data.toString());

      switch (message.type) {
        case 'ping':
          // Respond to ping with pong
          const pongMessage: WebSocketMessage = {
            type: 'pong',
            message: 'Server is alive!',
            timestamp: new Date().toISOString(),
            originalMessage: message
          };
          ws.send(JSON.stringify(pongMessage));
          break;

        case 'echo':
          // Echo back the message
          const echoMessage: WebSocketMessage = {
            type: 'echo-response',
            message: `Echo: ${message.message}`,
            timestamp: new Date().toISOString(),
            originalMessage: message
          };
          ws.send(JSON.stringify(echoMessage));
          break;

        case 'broadcast':
          // Broadcast message to all connected clients
          const broadcastMessage: WebSocketMessage = {
            type: 'broadcast-message',
            message: message.message,
            timestamp: new Date().toISOString(),
            clientCount: clients.size
          };
          
          clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(broadcastMessage));
            }
          });
          break;

        default:
          const errorMessage: WebSocketMessage = {
            type: 'error',
            message: `Unknown message type: ${message.type}`,
            timestamp: new Date().toISOString()
          };
          ws.send(JSON.stringify(errorMessage));
      }
    } catch {
      const errorMessage: WebSocketMessage = {
        type: 'error',
        message: 'Invalid JSON message',
        timestamp: new Date().toISOString()
      };
      ws.send(JSON.stringify(errorMessage));
    }
  });

  // Handle client disconnect
  ws.on('close', () => {
    clients.delete(ws);
  });

  // Handle WebSocket errors
  ws.on('error', () => {
    clients.delete(ws);
  });
});

const app = express();
app.use(cors());

// REST endpoint for models
app.get('/models', (req: Request, res: Response) => {
  res.json(sttModels);
});

// Attach express app to the same HTTP server
server.on('request', app);

// Start the server
server.listen(PORT, () => {
  // Server started successfully
});

// Graceful shutdown
process.on('SIGINT', () => {
  // Close all WebSocket connections
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.close(1000, 'Server shutting down');
    }
  });
  
  // Close the server
  server.close(() => {
    process.exit(0);
  });
});

export { wss, clients }; 