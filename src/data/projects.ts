import type { ProjectSystem } from '../types'

export const projects: ProjectSystem[] = [
  {
    id: 'voice-ai',
    name: 'VOICE AI',
    wrongDoor: {
      title: 'THE ESCALATION DECISION',
      statement: 'YOU CAME FOR THE PROJECT. START WITH THE DECISION.',
      chain: ['CONFIDENCE THRESHOLD', 'UNCERTAIN INPUT', 'HUMAN ESCALATION'],
    },
    chain: [
      { id: 'mic', label: 'MIC', evidenceId: 'voice-mic' },
      { id: 'stt', label: 'STT', evidenceId: 'voice-stt' },
      { id: 'nlu', label: 'NLU', evidenceId: 'voice-nlu' },
      { id: 'dialogue', label: 'DIALOGUE', evidenceId: 'voice-dialogue' },
      { id: 'tts', label: 'TTS', evidenceId: 'voice-tts' },
    ],
  },
  {
    id: 'friday',
    name: 'FRIDAY',
    chain: [
      { id: 'request', label: 'REQUEST', evidenceId: 'friday-request' },
      { id: 'orchestrator', label: 'ORCHESTRATOR', evidenceId: 'friday-orchestrator' },
      { id: 'trust', label: 'TRUST', evidenceId: 'friday-trust' },
      { id: 'validator', label: 'VALIDATOR', evidenceId: 'friday-validator' },
      { id: 'action', label: 'ACTION', evidenceId: 'friday-action' },
    ],
  },
]
