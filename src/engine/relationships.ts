import { relationships } from '../data/relationships'

export function getRelatedEvidence(id: string): string[] {
  return relationships[id] ?? []
}
