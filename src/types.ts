export type ProjectId = 'voice-ai' | 'friday'
export type NodeId =
  | 'mic'
  | 'stt'
  | 'nlu'
  | 'dialogue'
  | 'tts'
  | 'request'
  | 'orchestrator'
  | 'trust'
  | 'validator'
  | 'action'
export type TechId =
  | 'whisper-cpp'
  | 'onnx-distilbert'
  | 'piper-tts'
  | 'asyncio'
  | 'groq-fallback'
  | 'edge-inference'
  | 'orange-pi-5'
  | 'claude-api'
  | 'python-orchestrator'
  | 'rust-watcher'
  | 'context-engine'
  | 'permission-model'
  | 'native-c-validator'
  | 'sqlite'
  | 'pyside6'
  | 'fake-provider-tests'

export type InvestigationQuestion =
  | 'can-he-build'
  | 'how-he-thinks'
  | 'what-he-done'
  | 'what-different'
  | 'unexpected'

export type TimeMode = '30 SEC' | '1 MIN' | '3 MIN' | 'EXPLORE'

export type DisclosureLevel = 'GLANCE' | 'UNDERSTAND' | 'INVESTIGATE'

export interface Evidence {
  id: string
  projectId?: ProjectId
  title: string
  glance: string
  understand: string
  investigate: string
  technologies?: TechId[]
  relatedEvidenceIds?: string[]
  sourceLabel?: string
}

export interface ProjectNode {
  id: NodeId
  label: string
  evidenceId: string
}

export interface ProjectSystem {
  id: ProjectId
  name: string
  wrongDoor?: {
    title: string
    statement: string
    chain: string[]
  }
  chain: ProjectNode[]
}

export interface Scenario {
  id: string
  prompt: string
  systemDecision: 'ANSWER' | 'ESCALATE'
  why: string
  principle: string
}

export interface Experiment {
  id: string
  name: string
  details: string[]
  lesson?: string
}
