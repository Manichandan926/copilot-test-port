import type { Scenario } from '../types'

export const proveItScenarios: Scenario[] = [
  {
    id: 'billing-partial',
    prompt:
      'Customer says: “I was charged twice, but one charge disappeared from my banking app after an hour.”',
    systemDecision: 'ESCALATE',
    why: 'Conflicting payment visibility suggests account-specific ambiguity and potential financial risk.',
    principle: 'Escalate when confidence is low and consequences of a wrong answer are high.',
  },
  {
    id: 'password-reset',
    prompt: 'Customer says: “I reset my password and now login works. Can I keep using the same MFA app?”',
    systemDecision: 'ANSWER',
    why: 'Intent is clear and falls within known policy guidance.',
    principle: 'Answer when intent is high-confidence and policy is deterministic.',
  },
  {
    id: 'delivery-window',
    prompt:
      'Customer says: “The app says delivered, but building reception did not get anything yet. Should I dispute now?”',
    systemDecision: 'ESCALATE',
    why: 'Delivery disputes involve order-state uncertainty and potential irreversible actions.',
    principle: 'Escalate whenever uncertainty intersects with irreversible account actions.',
  },
]

export const thinkingChoices = [
  'CHECK LOGS FIRST',
  'REPRODUCE WITH MINIMAL INPUT',
  'PATCH IMMEDIATELY',
] as const

export const maniFirstMove = 'REPRODUCE WITH MINIMAL INPUT'

export const maniReasoningChain = ['OBSERVE', 'ISOLATE', 'TEST', 'CHANGE', 'VERIFY'] as const
