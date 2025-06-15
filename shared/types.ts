export interface WebSocketMessage {
  type: string;
  message: string;
  timestamp: string;
  [key: string]: unknown;
}

export interface PingMessage extends WebSocketMessage {
  type: 'ping';
}

export interface PongMessage extends WebSocketMessage {
  type: 'pong';
  originalMessage: WebSocketMessage;
}

export interface EchoMessage extends WebSocketMessage {
  type: 'echo';
}

export interface EchoResponseMessage extends WebSocketMessage {
  type: 'echo-response';
  originalMessage: WebSocketMessage;
}

export interface BroadcastMessage extends WebSocketMessage {
  type: 'broadcast';
}

export interface BroadcastResponseMessage extends WebSocketMessage {
  type: 'broadcast-message';
  clientCount: number;
}

export interface WelcomeMessage extends WebSocketMessage {
  type: 'welcome';
}

export interface ErrorMessage extends WebSocketMessage {
  type: 'error';
}

export type MessageType = 
  | 'ping' 
  | 'pong' 
  | 'echo' 
  | 'echo-response' 
  | 'broadcast' 
  | 'broadcast-message' 
  | 'welcome' 
  | 'error'; 