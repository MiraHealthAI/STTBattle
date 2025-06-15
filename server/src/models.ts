import { STTModel } from '@shared/types';

export const sttModels: STTModel[] = [
  {
    id: 'google-general',
    name: 'General Model',
    provider: 'Google Cloud Speech-to-Text',
    providerId: 'google',
    type: 'general',
    description: 'Google\'s advanced speech recognition (general domain)'
  },
  {
    id: 'google-medical',
    name: 'Medical Model',
    provider: 'Google Cloud Speech-to-Text',
    providerId: 'google',
    type: 'medical',
    description: 'Google\'s medical speech recognition model'
  },
  {
    id: 'aws-general',
    name: 'Standard Model',
    provider: 'AWS Transcribe',
    providerId: 'aws',
    type: 'general',
    description: 'Amazon\'s standard speech-to-text model'
  },
  {
    id: 'aws-medical',
    name: 'Medical Model',
    provider: 'AWS Transcribe',
    providerId: 'aws',
    type: 'medical',
    description: 'Amazon\'s medical speech-to-text model'
  },
  {
    id: 'azure-general',
    name: 'General Model',
    provider: 'Microsoft Azure Speech',
    providerId: 'azure',
    type: 'general',
    description: 'Microsoft\'s general speech-to-text model'
  },
  {
    id: 'azure-medical',
    name: 'Medical Model',
    provider: 'Microsoft Azure Speech',
    providerId: 'azure',
    type: 'medical',
    description: 'Microsoft\'s medical speech-to-text model'
  },
  {
    id: 'deepgram-nova2',
    name: 'Nova-2 General',
    provider: 'Deepgram',
    providerId: 'deepgram',
    type: 'general',
    description: 'Deepgram\'s Nova-2 general model'
  },
  {
    id: 'deepgram-medical',
    name: 'Nova-2 Medical',
    provider: 'Deepgram',
    providerId: 'deepgram',
    type: 'medical',
    description: 'Deepgram\'s Nova-2 medical model'
  },
  {
    id: 'openai-whisper-1',
    name: 'Whisper-1',
    provider: 'OpenAI Whisper',
    providerId: 'openai',
    type: 'general',
    description: 'OpenAI\'s Whisper-1 model'
  }
]; 