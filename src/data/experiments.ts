import type { Experiment } from '../types'

export const experiments: Experiment[] = [
  {
    id: 'manios',
    name: 'ManiOS',
    details: ['bootloader', 'paging', 'scheduler', 'compositing GUI stack'],
    lesson:
      'Cross-file consistency failures became a direct lesson that later informed the FRIDAY context engine.',
  },
  {
    id: 'groq-fallback-layer',
    name: 'Groq fallback layer',
    details: [
      'Voice AI demo fallback with Llama 3.1 8B via Groq',
      'silent fallback when unavailable',
    ],
  },
  {
    id: 'friday-model',
    name: 'friday-model',
    details: [
      'Experiment toward replacing cloud API brain',
      'QLoRA on Qwen2.5-7B-Instruct',
    ],
  },
]
