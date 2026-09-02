import type { ProjectId } from '../types'

export type QuickViewIntent = 'SOFTWARE / SYSTEMS' | 'AI / ML' | 'NOT SURE YET'

export function orderProjectsByIntent(intent: QuickViewIntent): ProjectId[] {
  if (intent === 'SOFTWARE / SYSTEMS') {
    return ['friday', 'voice-ai']
  }

  if (intent === 'AI / ML') {
    return ['voice-ai', 'friday']
  }

  return ['voice-ai', 'friday']
}
