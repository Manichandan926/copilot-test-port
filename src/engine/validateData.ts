import { evidence } from '../data/evidence'
import { experiments } from '../data/experiments'
import { projects } from '../data/projects'
import { proveItScenarios } from '../data/scenarios'
import { relationships } from '../data/relationships'

export function validateDataModel(): string[] {
  const issues: string[] = []

  const evidenceIds = new Set<string>()
  for (const item of evidence) {
    if (evidenceIds.has(item.id)) {
      issues.push(`Duplicate evidence id: ${item.id}`)
    }
    evidenceIds.add(item.id)
  }

  const projectIds = new Set(projects.map((project) => project.id))
  const nodeEvidenceIds = new Set(
    projects.flatMap((project) => project.chain.map((node) => node.evidenceId)),
  )

  for (const evidenceId of nodeEvidenceIds) {
    if (!evidenceIds.has(evidenceId)) {
      issues.push(`Missing evidence for node: ${evidenceId}`)
    }
  }

  for (const item of evidence) {
    if (item.projectId && !projectIds.has(item.projectId)) {
      issues.push(`Invalid project reference on evidence: ${item.id}`)
    }

    for (const related of item.relatedEvidenceIds ?? []) {
      if (!evidenceIds.has(related)) {
        issues.push(`Broken related evidence reference: ${item.id} -> ${related}`)
      }
    }
  }

  for (const [from, toList] of Object.entries(relationships)) {
    if (!evidenceIds.has(from)) {
      issues.push(`Relationship source missing: ${from}`)
    }

    for (const to of toList) {
      if (!evidenceIds.has(to)) {
        issues.push(`Relationship target missing: ${from} -> ${to}`)
      }
    }
  }

  if (proveItScenarios.length === 0) {
    issues.push('No prove-it scenarios configured')
  }

  if (experiments.length === 0) {
    issues.push('No lab experiments configured')
  }

  return issues
}
