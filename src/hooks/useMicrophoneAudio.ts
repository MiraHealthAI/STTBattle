import { useRef, useState, useCallback } from 'react';

export function useMicrophoneAudio({ onAudioChunk }: { onAudioChunk: (chunk: Uint8Array) => void }) {
  const [isRecording, setIsRecording] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const start = useCallback(async () => {
    if (isRecording) return;
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = audioContext;
    const source = audioContext.createMediaStreamSource(stream);
    const processor = audioContext.createScriptProcessor(1024, 1, 1);
    processorRef.current = processor;

    processor.onaudioprocess = (e) => {
      const input = e.inputBuffer.getChannelData(0); // mono
      const pcm16 = convertFloat32To16Bit(input);
      onAudioChunk(pcm16);
    };
    source.connect(processor);
    processor.connect(audioContext.destination);
  }, [isRecording, onAudioChunk]);

  const stop = useCallback(() => {
    setIsRecording(false);
    processorRef.current?.disconnect();
    audioContextRef.current?.close();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    processorRef.current = null;
    audioContextRef.current = null;
    streamRef.current = null;
  }, []);

  return { start, stop, isRecording };
} 

function convertFloat32To16Bit(input: Float32Array): Uint8Array {
  const pcm16 = new Uint8Array(input.length * 2);
  for (let i = 0; i < input.length; i++) {
    let s = Math.max(-1, Math.min(1, input[i]));
    s = s < 0 ? s * 0x8000 : s * 0x7FFF;
    const val = Math.round(s);
    pcm16[i * 2] = val & 0xFF;
    pcm16[i * 2 + 1] = (val >> 8) & 0xFF;
  }
  return pcm16;
}