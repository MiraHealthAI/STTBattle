"use client";

import { Button } from "@/components/ui/button";
import { Play, Square, Settings } from "lucide-react";

interface ControlBarProps {
  isRecording: boolean;
  onToggleRecording: () => void;
  onOpenSettings: () => void;
}

export default function ControlBar({ 
  isRecording, 
  onToggleRecording, 
  onOpenSettings 
}: ControlBarProps) {
  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-4 space-x-4">
          <Button
            onClick={onToggleRecording}
            variant={isRecording ? "destructive" : "default"}
            size="lg"
            className="flex items-center space-x-2 px-8"
          >
            {isRecording ? (
              <>
                <Square className="w-4 h-4" />
                <span>Stop Recording</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Start Recording</span>
              </>
            )}
          </Button>
          
          <Button
            onClick={onOpenSettings}
            variant="outline"
            size="lg"
            className="flex items-center space-x-2"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Button>
        </div>
      </div>
    </div>
  );
} 