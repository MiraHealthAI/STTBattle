'use client';

import { useState } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';

const WebSocketTest = () => {
  const [wsUrl, setWsUrl] = useState('ws://localhost:8080');
  const [testMessage, setTestMessage] = useState('Hello from frontend!');
  
  const {
    connectionStatus,
    lastMessage,
    sendMessage,
    connect,
    disconnect,
    messages
  } = useWebSocket(wsUrl);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'text-green-600';
      case 'Connecting': return 'text-yellow-600';
      case 'Closing': return 'text-orange-600';
      case 'Closed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open': return '🟢';
      case 'Connecting': return '🟡';
      case 'Closing': return '🟠';
      case 'Closed': return '🔴';
      default: return '⚪';
    }
  };

  const sendPing = () => {
    sendMessage({
      type: 'ping',
      message: 'ping',
      timestamp: new Date().toISOString()
    });
  };

  const sendEcho = () => {
    sendMessage({
      type: 'echo',
      message: testMessage,
      timestamp: new Date().toISOString()
    });
  };

  const sendBroadcast = () => {
    sendMessage({
      type: 'broadcast',
      message: `Broadcast: ${testMessage}`,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">WebSocket Connection Test</h2>
        
        {/* Connection Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="wsUrl" className="block text-sm font-medium text-gray-700 mb-2">
              WebSocket URL:
            </label>
            <input
              id="wsUrl"
              type="text"
              value={wsUrl}
              onChange={(e) => setWsUrl(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ws://localhost:8080"
            />
          </div>
          
          <div className="flex items-end">
            <div className="space-x-2">
              <button
                onClick={connect}
                disabled={connectionStatus === 'Open' || connectionStatus === 'Connecting'}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Connect
              </button>
              <button
                onClick={disconnect}
                disabled={connectionStatus === 'Closed' || connectionStatus === 'Closing'}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">{getStatusIcon(connectionStatus)}</span>
            <span className={`font-semibold ${getStatusColor(connectionStatus)}`}>
              Status: {connectionStatus}
            </span>
          </div>
          {lastMessage && (
            <div className="text-sm text-gray-600">
              <strong>Last Message:</strong> {lastMessage.type} - {lastMessage.message}
              <br />
              <strong>Timestamp:</strong> {new Date(lastMessage.timestamp).toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Test Controls */}
        <div className="space-y-4">
          <div>
            <label htmlFor="testMessage" className="block text-sm font-medium text-gray-700 mb-2">
              Test Message:
            </label>
            <input
              id="testMessage"
              type="text"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter a test message"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={sendPing}
              disabled={connectionStatus !== 'Open'}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send Ping
            </button>
            <button
              onClick={sendEcho}
              disabled={connectionStatus !== 'Open'}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send Echo
            </button>
            <button
              onClick={sendBroadcast}
              disabled={connectionStatus !== 'Open'}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send Broadcast
            </button>
          </div>
        </div>
      </div>

      {/* Message History */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">Message History</h3>
        <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-gray-500">No messages yet. Connect to start receiving messages.</div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className="mb-2">
                <span className="text-gray-400">[{new Date(msg.timestamp).toLocaleTimeString()}]</span>
                <span className="text-blue-400 ml-2">{msg.type}:</span>
                <span className="ml-2">{msg.message}</span>
              </div>
            ))
          )}
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Clear History
          </button>
        )}
      </div>
    </div>
  );
};

export default WebSocketTest; 