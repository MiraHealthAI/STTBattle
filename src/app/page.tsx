"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ControlBar from '@/components/ControlBar';
import Settings from '@/components/Settings';
import TranscriptionPanel, { type TranscriptionStatus, type STTProvider } from '@/components/TranscriptionPanel';
import { STTModel } from '@shared/types';
import { useMicrophoneAudio } from '@/hooks/useMicrophoneAudio';

interface TranscriptionState {
  [modelId: string]: {
    transcript: string;
    status: TranscriptionStatus;
    model?: STTModel;
  };
}

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [models, setModels] = useState<STTModel[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [transcriptionStates, setTranscriptionStates] = useState<TranscriptionState>({});

  const { start: startMic, stop: stopMic } = useMicrophoneAudio({
    onAudioChunk: (chunk) => {
      // For now, just log chunk info
      console.log('Audio chunk', chunk.length, 'bytes');
    }
  });

  useEffect(() => {
    if (isRecording) {
      startMic();
    } else {
      stopMic();
    }
  }, [isRecording, startMic, stopMic]);

  // Fetch models on mount
  useEffect(() => {
    fetch("http://localhost:8080/models")
      .then(res => res.json())
      .then(setModels)
      .catch(() => setModels([]));
  }, []);

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    // Update all transcription statuses based on recording state
    const newStates: TranscriptionState = {};
    selectedModels.forEach(modelId => {
      newStates[modelId] = {
        transcript: transcriptionStates[modelId]?.transcript || '',
        status: !isRecording ? 'connecting' : 'stopped',
        model: models.find(m => m.id === modelId)
      };
    });
    setTranscriptionStates(newStates);
  };

  const handleTranscriptChange = (modelId: string, transcript: string) => {
    setTranscriptionStates(prev => ({
      ...prev,
      [modelId]: {
        ...prev[modelId],
        transcript
      }
    }));
  };

  const activeModels = selectedModels
    .map(modelId => models.find(m => m.id === modelId))
    .filter(Boolean) as STTModel[];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ControlBar
        isRecording={isRecording}
        onToggleRecording={handleToggleRecording}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeModels.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Models Selected
              </h3>
              <p className="text-gray-600 mb-6">
                Choose STT models from settings to start comparing transcriptions.
              </p>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Open Settings
              </button>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              activeModels.length === 1 ? 'grid-cols-1' :
              activeModels.length === 2 ? 'grid-cols-1 lg:grid-cols-2' :
              'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'
            }`}>
              {activeModels.map((model) => {
                const state = transcriptionStates[model.id] || { transcript: '', status: 'stopped', model };
                return (
                  <div key={model.id} className="min-h-[400px]">
                    <TranscriptionPanel
                      provider={model.providerId as STTProvider}
                      providerName={`${model.provider} - ${model.name}`}
                      status={state.status}
                      transcript={state.transcript}
                      onTranscriptChange={(transcript) => handleTranscriptChange(model.id, transcript)}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        selectedModels={selectedModels}
        onSelectedModelsChange={setSelectedModels}
      />
    </div>
  );
}
