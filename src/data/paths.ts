import type { InvestigationQuestion } from '../types'

export const investigationQuestions: Array<{ id: InvestigationQuestion; label: string }> = [
  { id: 'can-he-build', label: 'CAN HE BUILD?' },
  { id: 'how-he-thinks', label: 'HOW DOES HE THINK?' },
  { id: 'what-he-done', label: 'WHAT HAS HE ACTUALLY DONE?' },
  { id: 'what-different', label: 'WHAT MAKES HIM DIFFERENT?' },
  { id: 'unexpected', label: 'SHOW ME SOMETHING UNEXPECTED' },
]

export const lifePath = [
  'LEARNING',
  'BUILDING',
  'BREAKING',
  'UNDERSTANDING',
  'REBUILDING',
  'CURRENT',
] as const
