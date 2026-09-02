import type { TimeMode } from '../../types'

interface Props {
  current: string
  timeMode: TimeMode
  onTimeMode: (mode: TimeMode) => void
  onBack: () => void
  onStartOver: () => void
  onQuickView: () => void
  onContact: () => void
  canBack: boolean
}

const modes: TimeMode[] = ['30 SEC', '1 MIN', '3 MIN', 'EXPLORE']

export function ControlRail({
  current,
  timeMode,
  onTimeMode,
  onBack,
  onStartOver,
  onQuickView,
  onContact,
  canBack,
}: Props) {
  return (
    <aside className="control-rail" aria-label="Investigation controls">
      <p className="meta">CURRENT: {current}</p>
      <div className="rail-actions">
        <button type="button" onClick={onBack} disabled={!canBack}>
          BACK
        </button>
        <button type="button" onClick={onStartOver}>
          START OVER
        </button>
        <button type="button" onClick={onQuickView}>
          QUICK VIEW
        </button>
        <button type="button" onClick={onContact}>
          CONTACT
        </button>
      </div>
      <fieldset className="time-mode">
        <legend className="meta">TIME MODE</legend>
        {modes.map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => onTimeMode(mode)}
            aria-pressed={timeMode === mode}
            className={timeMode === mode ? 'active' : ''}
          >
            {mode}
          </button>
        ))}
      </fieldset>
    </aside>
  )
}
