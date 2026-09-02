import type { TimeMode } from '../types'

export const timeModeSequence: Record<TimeMode, string[]> = {
  '30 SEC': ['VERDICT'],
  '1 MIN': ['VERDICT', 'REASONING'],
  '3 MIN': ['VERDICT', 'ARCHITECTURE', 'FAILURE', 'REASONING'],
  EXPLORE: ['FULL INVESTIGATION'],
}
