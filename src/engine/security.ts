const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:'])

export function toSafeUrl(raw: string): string | null {
  try {
    const parsed = new URL(raw, 'https://example.local')
    if (!SAFE_PROTOCOLS.has(parsed.protocol)) {
      return null
    }

    return raw
  } catch {
    return null
  }
}
