import type { DisclosureLevel, InvestigationQuestion, ProjectId, TimeMode } from '../types'

export interface InvestigationRoute {
  question: InvestigationQuestion | null
  projectId: ProjectId | null
  nodeEvidenceId: string | null
  mode: 'investigation' | 'quick-view' | 'contact' | 'ending'
}

export interface OpenThread {
  projectId: ProjectId
  nodeEvidenceId: string | null
  status: 'OPEN' | 'CLOSED'
}

export interface InvestigationState {
  route: InvestigationRoute
  history: InvestigationRoute[]
  visitedEvidence: string[]
  openThreads: OpenThread[]
  disclosure: DisclosureLevel
  timeMode: TimeMode
}

export const initialState: InvestigationState = {
  route: {
    question: null,
    projectId: null,
    nodeEvidenceId: null,
    mode: 'investigation',
  },
  history: [],
  visitedEvidence: [],
  openThreads: [],
  disclosure: 'GLANCE',
  timeMode: 'EXPLORE',
}

export function serializeState(state: InvestigationState): string {
  return JSON.stringify(state)
}

export function parseState(raw: string | null): InvestigationState | null {
  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as InvestigationState
    return parsed
  } catch {
    return null
  }
}

export function updateOpenThread(
  threads: OpenThread[],
  projectId: ProjectId,
  nodeEvidenceId: string | null,
  status: OpenThread['status'],
): OpenThread[] {
  const existingIndex = threads.findIndex((thread) => thread.projectId === projectId)

  if (existingIndex === -1) {
    return [...threads, { projectId, nodeEvidenceId, status }]
  }

  return threads.map((thread, index) =>
    index === existingIndex ? { ...thread, nodeEvidenceId, status } : thread,
  )
}
