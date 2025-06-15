# Shared Types

This directory contains TypeScript type definitions that are shared between the frontend and backend components of the STT Battle application.

## Purpose

Having shared types ensures:
- **Type Safety**: Both frontend and backend use identical interfaces
- **No Type Drift**: Changes to message formats are automatically reflected in both codebases
- **Single Source of Truth**: All WebSocket message types are defined in one place

## Usage

### Frontend (Next.js)
```typescript
import { WebSocketMessage, PingMessage } from '@shared/types';
```

### Backend (Node.js)
```typescript
import { WebSocketMessage, PongMessage } from '@shared/types';
```

## Configuration

Both projects are configured with TypeScript path mapping:

### Frontend (`tsconfig.json`)
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@shared/*": ["./shared/*"]
    }
  }
}
```

### Backend (`server/tsconfig.json`)
```json
{
  "compilerOptions": {
    "rootDir": "../",
    "paths": {
      "@shared/*": ["../shared/*"]
    }
  },
  "include": ["src/**/*", "../shared/**/*"]
}
```

## Types

### WebSocketMessage
Base interface for all WebSocket messages with common fields:
- `type`: Message type identifier
- `message`: Human-readable message content
- `timestamp`: ISO timestamp of when message was created

### Specific Message Types
- `PingMessage`: Client ping to server
- `PongMessage`: Server response to ping
- `EchoMessage`: Client echo request
- `EchoResponseMessage`: Server echo response
- `BroadcastMessage`: Client broadcast request
- `BroadcastResponseMessage`: Server broadcast to all clients
- `WelcomeMessage`: Server welcome message on connection
- `ErrorMessage`: Error responses

## Maintenance

When making changes to message interfaces:
1. Update the types in `shared/types.ts`
2. Both frontend and backend will automatically get type checking for the changes
3. Test both builds to ensure compatibility 