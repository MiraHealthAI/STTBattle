"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Badge } from "@/components/ui/badge";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from 'react';

export type STTProvider = 'google' | 'aws' | 'azure' | 'deepgram' | 'openai';

export type TranscriptionStatus = 'connecting' | 'listening' | 'error' | 'stopped';

interface TranscriptionPanelProps {
  provider: STTProvider;
  providerName: string;
  status: TranscriptionStatus;
  transcript: string;
  onTranscriptChange?: (transcript: string) => void;
}

const statusConfig = {
  connecting: { 
    label: 'Connecting', 
    variant: 'secondary' as const,
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  listening: { 
    label: 'Listening', 
    variant: 'default' as const,
    color: 'bg-green-100 text-green-800 border-green-200'
  },
  error: { 
    label: 'Error', 
    variant: 'destructive' as const,
    color: 'bg-red-100 text-red-800 border-red-200'
  },
  stopped: { 
    label: 'Stopped', 
    variant: 'outline' as const,
    color: 'bg-gray-100 text-gray-800 border-gray-200'
  }
};

export default function TranscriptionPanel({ 
  provider, 
  providerName, 
  status, 
  transcript,
  onTranscriptChange 
}: TranscriptionPanelProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: transcript,
    editable: true,
    onUpdate: ({ editor }) => {
      const content = editor.getText();
      onTranscriptChange?.(content);
    },
  });

  // Update editor content when transcript changes from WebSocket
  useEffect(() => {
    if (editor && transcript !== editor.getText()) {
      editor.commands.setContent(transcript);
    }
  }, [transcript, editor]);

  const handleCopy = async () => {
    const content = editor?.getText() || '';
    try {
      await navigator.clipboard.writeText(content);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const config = statusConfig[status];

  return (
    <div className="bg-white rounded-lg border shadow-sm h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3">
          <h3 className="font-semibold text-gray-900">{providerName}</h3>
          <Badge 
            variant={config.variant}
            className={`${config.color} border`}
          >
            <div className={`w-2 h-2 rounded-full mr-2 ${
              status === 'listening' ? 'bg-green-500 animate-pulse' : 
              status === 'connecting' ? 'bg-yellow-500 animate-pulse' :
              status === 'error' ? 'bg-red-500' :
              'bg-gray-500'
            }`} />
            {config.label}
          </Badge>
        </div>
        
        <Button
          onClick={handleCopy}
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-gray-700"
        >
          <Copy className="w-4 h-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <div className="flex-1 p-4">
        <div className="prose prose-sm max-w-none h-full">
          <EditorContent 
            editor={editor} 
            className="min-h-[200px] h-full focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
} 