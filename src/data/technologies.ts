import type { TechId } from '../types'

export const technologyLabels: Record<TechId, string> = {
  'whisper-cpp': 'whisper.cpp',
  'onnx-distilbert': 'ONNX / DistilBERT',
  'piper-tts': 'piper-tts',
  asyncio: 'asyncio',
  'groq-fallback': 'Groq fallback / Llama 3.1 8B',
  'edge-inference': 'edge inference',
  'orange-pi-5': 'Orange Pi 5 (6 TOPS NPU)',
  'claude-api': 'Claude API',
  'python-orchestrator': 'Python orchestrator',
  'rust-watcher': 'Rust watcher daemon (~3MB idle)',
  'context-engine': 'context engine',
  'permission-model': 'three-tier permission model',
  'native-c-validator': 'native C command validator',
  sqlite: 'SQLite',
  pyside6: 'PySide6',
  'fake-provider-tests': 'fake LLM provider / 276 tests',
}
