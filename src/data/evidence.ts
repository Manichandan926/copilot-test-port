import type { Evidence } from '../types'

export const evidence: Evidence[] = [
  {
    id: 'voice-mic',
    projectId: 'voice-ai',
    title: 'MIC INPUT',
    glance: 'PipeWire microphone failure forced robust input fallback during prototyping.',
    understand:
      'The keyboard-driven console prototype became a resilience layer whenever PipeWire failed to expose the microphone stream.',
    investigate:
      'The early Voice AI loop intentionally allowed keyboard text injection so ASR issues could be isolated from downstream NLU and dialogue behavior.',
    technologies: ['asyncio'],
    relatedEvidenceIds: ['debug-pipewire'],
    sourceLabel: 'FROM: VOICE AI / INPUT',
  },
  {
    id: 'voice-stt',
    projectId: 'voice-ai',
    title: 'SPEECH TO TEXT',
    glance: 'whisper.cpp powers local transcription.',
    understand:
      'Local STT avoided round-trip latency and kept the support flow operational without cloud dependency for transcription.',
    investigate:
      'The MIC → STT boundary was tuned for real-time support pacing, then combined with escalation rules for uncertain utterances.',
    technologies: ['whisper-cpp', 'edge-inference'],
    sourceLabel: 'FROM: VOICE AI / CHAIN',
  },
  {
    id: 'voice-nlu',
    projectId: 'voice-ai',
    title: 'NLU',
    glance: 'ONNX DistilBERT handled intent parsing.',
    understand:
      'The NLU stage classified customer intent quickly enough for the dialogue stage to choose answer vs escalation behavior.',
    investigate:
      'DistilBERT exported to ONNX created a compact inference step suitable for edge constraints while still supporting support-domain intent routing.',
    technologies: ['onnx-distilbert'],
    sourceLabel: 'FROM: VOICE AI / CHAIN',
  },
  {
    id: 'voice-dialogue',
    projectId: 'voice-ai',
    title: 'DIALOGUE + ESCALATION',
    glance: 'Confidence thresholds determine answer vs human escalation.',
    understand:
      'Low-confidence interpretations trigger escalation rather than hallucinated support answers.',
    investigate:
      'Decision policy: uncertain input + threshold breach => escalate to a human channel. Groq Llama 3.1 8B fallback was available for demos when local path was unavailable.',
    technologies: ['groq-fallback'],
    relatedEvidenceIds: ['voice-prove-it'],
    sourceLabel: 'FROM: VOICE AI / DECISION',
  },
  {
    id: 'voice-tts',
    projectId: 'voice-ai',
    title: 'TEXT TO SPEECH',
    glance: 'piper-tts closes the loop for spoken responses.',
    understand:
      'TTS response stays local and pairs with the dialogue decision so escalations stay explicit instead of sounding final.',
    investigate:
      'The STT/NLU/TTS chain ran on Orange Pi 5 edge constraints with 6 TOPS NPU reasoning goals guiding deployment choices.',
    technologies: ['piper-tts', 'orange-pi-5', 'edge-inference'],
    relatedEvidenceIds: ['orange-pi-choice'],
    sourceLabel: 'FROM: VOICE AI / OUTPUT',
  },
  {
    id: 'friday-request',
    projectId: 'friday',
    title: 'REQUEST ENTRY',
    glance: 'Claude API requests enter a controlled orchestration pipeline.',
    understand:
      'User intent never jumps directly to command execution. It first enters trust and validation layers.',
    investigate:
      'FRIDAY framed each request as potentially unsafe until it passed orchestrator + trust checks + validator approval.',
    technologies: ['claude-api', 'python-orchestrator'],
    sourceLabel: 'FROM: FRIDAY / PIPELINE',
  },
  {
    id: 'friday-orchestrator',
    projectId: 'friday',
    title: 'ORCHESTRATOR',
    glance: 'Python orchestrator coordinates context engine, permissions, and action planning.',
    understand:
      'Orchestration keeps model output separated from system actions by introducing deterministic policy checks.',
    investigate:
      'A Rust watcher daemon (~3MB idle) observed state and fed context into orchestrator decisions while SQLite persisted workflow memory.',
    technologies: ['python-orchestrator', 'rust-watcher', 'context-engine', 'sqlite'],
    relatedEvidenceIds: ['manios-lesson'],
    sourceLabel: 'FROM: FRIDAY / CORE',
  },
  {
    id: 'friday-trust',
    projectId: 'friday',
    title: 'TRUST BOUNDARY',
    glance: 'Three-tier permission model gates risky operations.',
    understand:
      'Permissions classify actions by risk before validator-level command checks run.',
    investigate:
      'Trust boundary exists so language-model confidence never substitutes for authorization. Policy tiering narrows blast radius.',
    technologies: ['permission-model'],
    relatedEvidenceIds: ['friday-tests', 'friday-validator'],
    sourceLabel: 'FROM: FRIDAY / FAILURE',
  },
  {
    id: 'friday-validator',
    projectId: 'friday',
    title: 'COMMAND VALIDATOR',
    glance: 'Native C validator hardened after command-substitution bypass discovery.',
    understand:
      'Approval-word matching and substitution edge cases exposed trust gaps that were patched with stronger validation rules.',
    investigate:
      'Failure flow: intact -> bypass discovered -> root cause in command substitution handling -> validator hardened -> regression tests added.',
    technologies: ['native-c-validator'],
    relatedEvidenceIds: ['friday-failure-flow', 'friday-tests'],
    sourceLabel: 'FROM: FRIDAY / FAILURE',
  },
  {
    id: 'friday-action',
    projectId: 'friday',
    title: 'ACTION EXECUTION',
    glance: 'Validated actions execute only after trust + validator pass.',
    understand:
      'The architecture intentionally slows execution to enforce checks before system-level effects occur.',
    investigate:
      'PySide6 UI and orchestrator telemetry keep approvals observable so risky actions remain auditable.',
    technologies: ['pyside6'],
    sourceLabel: 'FROM: FRIDAY / PIPELINE',
  },
  {
    id: 'friday-tests',
    projectId: 'friday',
    title: 'TEST STRATEGY',
    glance: '276 passing tests against a fake LLM provider.',
    understand:
      'The fake provider enabled deterministic behavior for validation and permission regressions.',
    investigate:
      'Test harness captured bypass cases and approval-word edge conditions so fixes were verifiable and repeatable.',
    technologies: ['fake-provider-tests'],
    sourceLabel: 'FROM: FRIDAY / QUALITY',
  },
  {
    id: 'friday-failure-flow',
    projectId: 'friday',
    title: 'FAILURE RECONSTRUCTION',
    glance: 'INTACT → BROKEN → ROOT CAUSE → FIX → TESTED.',
    understand:
      'The bypass incident became the central reasoning artifact in FRIDAY, not a hidden postmortem.',
    investigate:
      'COMMAND → BYPASS → DISCOVERY → VALIDATOR → REGRESSION TEST is now part of the architecture narrative.',
    sourceLabel: 'FROM: FRIDAY / FAILURE',
  },
  {
    id: 'voice-prove-it',
    projectId: 'voice-ai',
    title: 'PROVE IT TO YOURSELF',
    glance: 'Visitors predict answer vs escalate on ambiguous support prompts.',
    understand:
      'The interaction reveals policy behavior without claiming infallibility.',
    investigate:
      'Hypothesis -> prediction -> observation -> conclusion anchors escalation policy understanding.',
    sourceLabel: 'FROM: VOICE AI / DECISION',
  },
  {
    id: 'orange-pi-choice',
    projectId: 'voice-ai',
    title: 'ORANGE PI DECISION',
    glance: 'Orange Pi 5 + 6 TOPS NPU framed edge inference constraints.',
    understand:
      'Hardware limits shaped model and latency decisions.',
    investigate:
      'Edge deployment required balancing on-device responsiveness with fallback behavior.',
    technologies: ['orange-pi-5', 'edge-inference'],
    sourceLabel: 'FROM: VOICE AI / DEPLOYMENT',
  },
  {
    id: 'manios-lesson',
    title: 'MANIOS LESSON',
    glance: 'Cross-file consistency failures informed FRIDAY context engine discipline.',
    understand:
      'The OS experiment exposed how AI-generated modules drift without strict continuity controls.',
    investigate:
      'Bootloader, paging, scheduler, and GUI stack generation failures created a direct lesson later used in FRIDAY context design.',
    sourceLabel: 'FROM: LAB / MANIOS',
  },
  {
    id: 'debug-pipewire',
    title: 'PIPEWIRE FAILURE',
    glance: 'Input failure became a debugging-method artifact.',
    understand:
      'By isolating audio capture from inference layers, debugging remained tractable.',
    investigate:
      'The keyboard fallback let the team validate NLU and dialogue continuity while microphone I/O was unstable.',
    sourceLabel: 'FROM: VOICE AI / INPUT',
  },
]
