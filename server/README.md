# STT Battle WebSocket Server

This is the standalone Node.js WebSocket server for the STT Battle application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp env.example .env.local
# Edit .env.local with your configuration
```

3. Development:
```bash
npm run dev
```

4. Production:
```bash
npm run build
npm start
```

## Environment Variables

- `PORT`: Server port (default: 8080)
- `FRONTEND_URL`: Frontend URL for CORS (default: http://localhost:3000)

## WebSocket API

The server supports the following message types:

### Client to Server Messages

#### Ping
```json
{
  "type": "ping",
  "message": "ping",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### Echo
```json
{
  "type": "echo",
  "message": "Hello, server!",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### Broadcast
```json
{
  "type": "broadcast",
  "message": "Message to all clients",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Server to Client Messages

#### Welcome
```json
{
  "type": "welcome",
  "message": "Connected to STT Battle WebSocket server",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### Pong
```json
{
  "type": "pong",
  "message": "Server is alive!",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "originalMessage": { ... }
}
```

#### Echo Response
```json
{
  "type": "echo-response",
  "message": "Echo: Hello, server!",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "originalMessage": { ... }
}
```

#### Broadcast Message
```json
{
  "type": "broadcast-message",
  "message": "Message to all clients",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "clientCount": 3
}
```

#### Error
```json
{
  "type": "error",
  "message": "Error description",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Deployment

This server is designed to be deployed on platforms like Render, Railway, or Heroku. The `PORT` environment variable will be automatically set by the platform.

For Render deployment:
1. Connect your GitHub repository
2. Set the build command: `npm run build`
3. Set the start command: `npm start`
4. Set environment variables in the Render dashboard 