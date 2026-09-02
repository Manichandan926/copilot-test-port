export const relationships: Record<string, string[]> = {
  'orange-pi-choice': ['voice-tts'],
  'friday-validator': ['friday-trust', 'friday-tests'],
  'friday-trust': ['friday-validator', 'friday-tests'],
  'manios-lesson': ['friday-orchestrator'],
  'debug-pipewire': ['voice-mic'],
  'voice-dialogue': ['voice-prove-it'],
}
