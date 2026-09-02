import { useEffect, useRef } from 'react'
import { investigationQuestions } from '../../data/paths'
import type { InvestigationQuestion } from '../../types'

interface Props {
  onSelect: (question: InvestigationQuestion) => void
}

export function QuestionField({ onSelect }: Props) {
  const fieldRef = useRef<HTMLDivElement | null>(null)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    const field = fieldRef.current
    if (!field || window.matchMedia('(pointer: coarse)').matches) {
      return
    }

    const items = Array.from(field.querySelectorAll<HTMLButtonElement>('button[data-question]'))

    const applyProximity = (clientX: number, clientY: number) => {
      for (const button of items) {
        const rect = button.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const distance = Math.hypot(clientX - cx, clientY - cy)
        const maxDistance = 320
        const proximity = Math.max(0, 1 - distance / maxDistance)
        button.style.setProperty('--proximity', proximity.toFixed(4))
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current)
      }

      frameRef.current = requestAnimationFrame(() => {
        applyProximity(event.clientX, event.clientY)
      })
    }

    const onLeave = () => {
      for (const button of items) {
        button.style.setProperty('--proximity', '0')
      }
    }

    field.addEventListener('pointermove', onPointerMove)
    field.addEventListener('pointerleave', onLeave)

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current)
      }
      field.removeEventListener('pointermove', onPointerMove)
      field.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div ref={fieldRef} className="question-field" aria-label="Primary investigation questions">
      {investigationQuestions.map((question) => (
        <button
          key={question.id}
          type="button"
          data-question={question.id}
          onClick={() => onSelect(question.id)}
          className="question-chip"
        >
          {question.label}
        </button>
      ))}
    </div>
  )
}
