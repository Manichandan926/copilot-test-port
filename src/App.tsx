import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { ControlRail } from './components/investigation/ControlRail'
import { QuestionField } from './components/investigation/QuestionField'
import { profile, contactActions, contactChannels } from './data/profile'
import { projects } from './data/projects'
import { evidence } from './data/evidence'
import { proveItScenarios, thinkingChoices, maniFirstMove, maniReasoningChain } from './data/scenarios'
import { experiments } from './data/experiments'
import { technologyLabels } from './data/technologies'
import { lifePath } from './data/paths'
import { getRelatedEvidence } from './engine/relationships'
import { orderProjectsByIntent, type QuickViewIntent } from './engine/discovery'
import { timeModeSequence } from './engine/timeMode'
import { toSafeUrl } from './engine/security'
import { validateDataModel } from './engine/validateData'
import {
  initialState,
  parseState,
  serializeState,
  updateOpenThread,
  type InvestigationRoute,
  type InvestigationState,
} from './state/investigation'
import type { DisclosureLevel, InvestigationQuestion, ProjectId, TimeMode } from './types'

const SESSION_KEY = 'mani-investigate-session'

function routeToHash(route: InvestigationRoute): string {
  const params = new URLSearchParams()
  if (route.mode !== 'investigation') {
    params.set('mode', route.mode)
  }
  if (route.question) {
    params.set('q', route.question)
  }
  if (route.projectId) {
    params.set('p', route.projectId)
  }
  if (route.nodeEvidenceId) {
    params.set('e', route.nodeEvidenceId)
  }

  const value = params.toString()
  return value.length > 0 ? `#${value}` : ''
}

function hashToRoute(): InvestigationRoute {
  const hash = window.location.hash.replace(/^#/, '')
  const params = new URLSearchParams(hash)
  const modeParam = params.get('mode')
  const mode =
    modeParam === 'quick-view' || modeParam === 'contact' || modeParam === 'ending'
      ? modeParam
      : 'investigation'

  const question = params.get('q') as InvestigationQuestion | null
  const projectId = params.get('p') as ProjectId | null
  const nodeEvidenceId = params.get('e')

  const hasProject = projectId === 'voice-ai' || projectId === 'friday'

  return {
    mode,
    question:
      question === 'can-he-build' ||
      question === 'how-he-thinks' ||
      question === 'what-he-done' ||
      question === 'what-different' ||
      question === 'unexpected'
        ? question
        : null,
    projectId: hasProject ? projectId : null,
    nodeEvidenceId: nodeEvidenceId ?? null,
  }
}

function App() {
  const [state, setState] = useState<InvestigationState>(() => {
    const restored = parseState(sessionStorage.getItem(SESSION_KEY))
    if (restored) {
      return { ...restored, route: hashToRoute() }
    }

    return { ...initialState, route: hashToRoute() }
  })
  const [wrongDoorUnlocked, setWrongDoorUnlocked] = useState<Record<ProjectId, boolean>>({
    'voice-ai': false,
    friday: true,
  })
  const [proveItIndex, setProveItIndex] = useState(0)
  const [proveItChoice, setProveItChoice] = useState<'ANSWER' | 'ESCALATE' | null>(null)
  const [thinkingChoice, setThinkingChoice] = useState<string | null>(null)
  const [quickViewIntent, setQuickViewIntent] = useState<QuickViewIntent>('NOT SURE YET')
  const [contactIntent, setContactIntent] = useState<(typeof contactActions)[number]['id'] | null>(null)
  const [announcement, setAnnouncement] = useState('Investigation ready.')
  const [integrityIssues] = useState(() => validateDataModel())

  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY, serializeState(state))
  }, [state])

  useEffect(() => {
    const onPop = () => {
      const poppedRoute = hashToRoute()
      setState((current) => ({ ...current, route: poppedRoute }))
    }

    window.addEventListener('popstate', onPop)
    return () => {
      window.removeEventListener('popstate', onPop)
    }
  }, [])

  const navigate = (route: InvestigationRoute, replace = false) => {
    const nextHash = routeToHash(route)
    if (replace) {
      window.history.replaceState(null, '', `${window.location.pathname}${nextHash}`)
    } else {
      window.history.pushState(null, '', `${window.location.pathname}${nextHash}`)
    }

    setState((current) => ({
      ...current,
      history: [...current.history, current.route],
      route,
    }))
  }

  const chooseQuestion = (question: InvestigationQuestion) => {
    navigate({ mode: 'investigation', question, projectId: null, nodeEvidenceId: null })
    setAnnouncement(`Investigation started: ${question.replaceAll('-', ' ')}`)
  }

  const chooseProject = (projectId: ProjectId) => {
    navigate({ ...state.route, projectId, nodeEvidenceId: null })
    setState((current) => ({
      ...current,
      openThreads: updateOpenThread(current.openThreads, projectId, null, 'OPEN'),
    }))
    setAnnouncement(`Project under examination: ${projectId}`)
  }

  const activeProject = useMemo(
    () => projects.find((project) => project.id === state.route.projectId) ?? null,
    [state.route.projectId],
  )

  const activeEvidence = useMemo(
    () => evidence.find((item) => item.id === state.route.nodeEvidenceId) ?? null,
    [state.route.nodeEvidenceId],
  )

  const currentLabel =
    state.route.mode === 'quick-view'
      ? 'QUICK VIEW'
      : state.route.mode === 'contact'
        ? 'CONTACT'
        : state.route.projectId
          ? state.route.projectId.toUpperCase()
          : state.route.question
            ? state.route.question.replaceAll('-', ' ').toUpperCase()
            : 'ASK'

  const relatedIds = activeEvidence ? getRelatedEvidence(activeEvidence.id) : []

  const orderedQuickViewProjects = orderProjectsByIntent(quickViewIntent)

  const closeThread = () => {
    if (!state.route.projectId) {
      return
    }

    setState((current) => ({
      ...current,
      openThreads: updateOpenThread(
        current.openThreads,
        state.route.projectId as ProjectId,
        state.route.nodeEvidenceId,
        'CLOSED',
      ),
    }))
    setAnnouncement('Thread closed.')
  }

  const openThreadButtons = state.openThreads.filter((thread) => thread.status === 'OPEN')

  const timeModePlan = timeModeSequence[state.timeMode]

  const completeInvestigation = () => {
    navigate({ mode: 'ending', question: state.route.question, projectId: null, nodeEvidenceId: null })
    setAnnouncement('Investigation complete.')
  }

  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back()
      return
    }

    navigate({ ...initialState.route }, true)
  }

  const startOver = () => {
    setState((current) => ({
      ...initialState,
      timeMode: current.timeMode,
    }))
    navigate({ ...initialState.route }, true)
    setWrongDoorUnlocked({ 'voice-ai': false, friday: true })
    setAnnouncement('Reset to opening question.')
  }

  const gotoEvidence = (evidenceId: string) => {
    if (!state.route.projectId) {
      return
    }

    navigate({ ...state.route, nodeEvidenceId: evidenceId })
    setState((current) => ({
      ...current,
      visitedEvidence: current.visitedEvidence.includes(evidenceId)
        ? current.visitedEvidence
        : [...current.visitedEvidence, evidenceId],
      openThreads: updateOpenThread(current.openThreads, state.route.projectId as ProjectId, evidenceId, 'OPEN'),
    }))
  }

  const renderEvidenceBody = (level: DisclosureLevel) => {
    if (!activeEvidence) {
      return null
    }

    if (level === 'GLANCE') {
      return activeEvidence.glance
    }

    if (level === 'UNDERSTAND') {
      return activeEvidence.understand
    }

    return activeEvidence.investigate
  }

  const selectedScenario = proveItScenarios[proveItIndex]

  const visitedLabels = state.visitedEvidence
    .map((id) => evidence.find((item) => item.id === id)?.title)
    .filter((value): value is string => Boolean(value))

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to investigation
      </a>
      <ControlRail
        current={currentLabel}
        timeMode={state.timeMode}
        onTimeMode={(mode: TimeMode) => setState((current) => ({ ...current, timeMode: mode }))}
        onBack={goBack}
        onStartOver={startOver}
        onQuickView={() => navigate({ ...state.route, mode: 'quick-view' })}
        onContact={() => navigate({ ...state.route, mode: 'contact' })}
        canBack={state.route.question !== null || state.route.mode !== 'investigation'}
      />
      <main id="main-content">
        <p className="sr-only" aria-live="polite">
          {announcement}
        </p>

        {integrityIssues.length > 0 && (
          <section className="integrity" aria-live="polite">
            <h2>DATA INTEGRITY CHECK</h2>
            <ul>
              {integrityIssues.map((issue) => (
                <li key={issue}>{issue}</li>
              ))}
            </ul>
          </section>
        )}

        {state.route.question === null && state.route.mode === 'investigation' && (
          <section className="landing">
            <p className="meta">{profile.name}</p>
            <h1>DON'T SCROLL. ASK.</h1>
            <p className="editorial">WHAT DO YOU WANT TO KNOW?</p>
            <QuestionField onSelect={chooseQuestion} />
          </section>
        )}

        {state.route.mode === 'quick-view' && (
          <section className="panel" aria-labelledby="quick-view-heading">
            <h1 id="quick-view-heading">QUICK VIEW</h1>
            <p className="editorial">{profile.name} — {profile.role}</p>
            <p className="meta">WHAT ARE YOU HIRING FOR?</p>
            <div className="chip-row">
              {(['SOFTWARE / SYSTEMS', 'AI / ML', 'NOT SURE YET'] as QuickViewIntent[]).map((intent) => (
                <button
                  type="button"
                  key={intent}
                  onClick={() => setQuickViewIntent(intent)}
                  aria-pressed={quickViewIntent === intent}
                >
                  {intent}
                </button>
              ))}
            </div>
            <p className="meta">TIME SHAPE: {timeModePlan.join(' → ')}</p>
            <ol className="ordered-evidence">
              {orderedQuickViewProjects.map((projectId) => {
                const project = projects.find((item) => item.id === projectId)
                return (
                  <li key={projectId}>
                    <button
                      type="button"
                      onClick={() => {
                        navigate({
                          mode: 'investigation',
                          question: 'can-he-build',
                          projectId,
                          nodeEvidenceId: null,
                        })
                      }}
                    >
                      {project?.name}
                    </button>
                  </li>
                )
              })}
            </ol>
          </section>
        )}

        {state.route.mode === 'contact' && (
          <section className="panel" aria-labelledby="contact-heading">
            <h1 id="contact-heading">WHAT WOULD YOU LIKE TO DO?</h1>
            <div className="chip-row">
              {contactActions.map((action) => (
                <button
                  type="button"
                  key={action.id}
                  onClick={() => setContactIntent(action.id)}
                  aria-pressed={contactIntent === action.id}
                >
                  {action.label}
                </button>
              ))}
            </div>
            <ul className="contact-list">
              {Object.entries(contactChannels).map(([key, value]) => {
                const safe = toSafeUrl(value)
                return (
                  <li key={key}>
                    <span className="meta">{key.toUpperCase()}</span>
                    {safe ? (
                      <a href={safe} rel="noreferrer" target="_blank">
                        {value}
                      </a>
                    ) : (
                      <span className="editorial">AVAILABLE SOON</span>
                    )}
                  </li>
                )
              })}
            </ul>
            {contactIntent && <p className="meta">INTENT: {contactIntent.toUpperCase()}</p>}
          </section>
        )}

        {state.route.mode === 'ending' && (
          <section className="panel" aria-labelledby="ending-heading">
            <h1 id="ending-heading">INVESTIGATION COMPLETE.</h1>
            <p className="meta">YOU LOOKED AT:</p>
            <ul>
              {visitedLabels.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
            <p className="editorial">{profile.name}</p>
            <p className="editorial">WHAT WILL YOU BUILD NEXT?</p>
            {state.openThreads.some((thread) => thread.status === 'OPEN') && (
              <button
                type="button"
                onClick={() => {
                  const open = state.openThreads.find((thread) => thread.status === 'OPEN')
                  if (open) {
                    navigate({
                      mode: 'investigation',
                      question: 'can-he-build',
                      projectId: open.projectId,
                      nodeEvidenceId: open.nodeEvidenceId,
                    })
                  }
                }}
              >
                FOLLOW OPEN THREAD →
              </button>
            )}
            <div className="chip-row">
              <button type="button" onClick={startOver}>
                START AGAIN
              </button>
              <button type="button" onClick={() => navigate({ ...state.route, mode: 'quick-view' })}>
                QUICK VIEW
              </button>
              <button type="button" onClick={() => navigate({ ...state.route, mode: 'contact' })}>
                CONTACT
              </button>
            </div>
          </section>
        )}

        {state.route.mode === 'investigation' && state.route.question === 'can-he-build' && (
          <section className="panel" aria-labelledby="build-heading">
            <h1 id="build-heading">CAN HE BUILD?</h1>
            <p className="editorial">Projects under examination.</p>
            <div className="chip-row">
              {projects.map((project) => (
                <button
                  type="button"
                  key={project.id}
                  onClick={() => chooseProject(project.id)}
                  aria-pressed={state.route.projectId === project.id}
                >
                  {project.name}
                </button>
              ))}
            </div>

            {openThreadButtons.length > 0 && (
              <section className="open-threads" aria-label="Open threads">
                <p className="meta">OPEN THREADS</p>
                {openThreadButtons.map((thread) => (
                  <button
                    type="button"
                    key={thread.projectId}
                    onClick={() =>
                      navigate({
                        mode: 'investigation',
                        question: 'can-he-build',
                        projectId: thread.projectId,
                        nodeEvidenceId: thread.nodeEvidenceId,
                      })
                    }
                  >
                    THREAD OPEN: {thread.projectId.toUpperCase()}
                  </button>
                ))}
              </section>
            )}

            {activeProject && (
              <section className="system-view" aria-labelledby="system-heading">
                <h2 id="system-heading">{activeProject.name}</h2>

                {activeProject.id === 'voice-ai' && !wrongDoorUnlocked['voice-ai'] && activeProject.wrongDoor && (
                  <section className="wrong-door">
                    <h3>{activeProject.wrongDoor.title}</h3>
                    <p className="editorial">{activeProject.wrongDoor.statement}</p>
                    <p className="meta">{activeProject.wrongDoor.chain.join(' → ')}</p>
                    <button
                      type="button"
                      onClick={() =>
                        setWrongDoorUnlocked((current) => ({
                          ...current,
                          'voice-ai': true,
                        }))
                      }
                    >
                      SHOW ME THE WHOLE SYSTEM →
                    </button>
                  </section>
                )}

                {(activeProject.id !== 'voice-ai' || wrongDoorUnlocked['voice-ai']) && (
                  <div className="node-chain" role="list" aria-label={`${activeProject.name} system chain`}>
                    {activeProject.chain.map((node) => {
                      const isActive = state.route.nodeEvidenceId === node.evidenceId
                      const isQuiet = state.route.nodeEvidenceId !== null && !isActive
                      return (
                        <button
                          type="button"
                          key={node.id}
                          role="listitem"
                          onClick={() => gotoEvidence(node.evidenceId)}
                          className={`node ${isActive ? 'active' : ''} ${isQuiet ? 'quiet' : ''}`}
                          aria-pressed={isActive}
                        >
                          {node.label}
                        </button>
                      )
                    })}
                  </div>
                )}

                {activeEvidence && (
                  <article className="evidence-card" aria-labelledby="evidence-heading">
                    <p className="meta">{activeEvidence.sourceLabel}</p>
                    <h3 id="evidence-heading">{activeEvidence.title}</h3>
                    <div className="chip-row">
                      {(['GLANCE', 'UNDERSTAND', 'INVESTIGATE'] as DisclosureLevel[]).map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setState((current) => ({ ...current, disclosure: level }))}
                          aria-pressed={state.disclosure === level}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                    <p className="editorial">{renderEvidenceBody(state.disclosure)}</p>
                    {activeEvidence.technologies && activeEvidence.technologies.length > 0 && (
                      <p className="meta">
                        {activeEvidence.technologies.map((technology) => technologyLabels[technology]).join(' · ')}
                      </p>
                    )}
                    <div className="chip-row">
                      <button type="button" onClick={closeThread}>
                        MARK THREAD COMPLETE
                      </button>
                      <button type="button" onClick={completeInvestigation}>
                        INVESTIGATION COMPLETE
                      </button>
                    </div>
                  </article>
                )}

                {relatedIds.length > 0 && (
                  <aside className="margin-trace" aria-label="Related evidence thread">
                    <p className="meta">ANOTHER THREAD CONNECTS HERE</p>
                    {relatedIds.map((relatedId) => {
                      const related = evidence.find((item) => item.id === relatedId)
                      if (!related) {
                        return null
                      }

                      return (
                        <button
                          type="button"
                          key={related.id}
                          onClick={() => {
                            if (related.projectId) {
                              navigate({
                                mode: 'investigation',
                                question: 'can-he-build',
                                projectId: related.projectId,
                                nodeEvidenceId: related.id,
                              })
                            }
                          }}
                        >
                          FOLLOW THIS THREAD → {related.title}
                        </button>
                      )
                    })}
                  </aside>
                )}

                {activeProject.id === 'voice-ai' && wrongDoorUnlocked['voice-ai'] && (
                  <section className="signature" aria-labelledby="prove-it-heading">
                    <h3 id="prove-it-heading">WOULD YOU ANSWER OR ESCALATE?</h3>
                    <p className="editorial">{selectedScenario.prompt}</p>
                    <div className="chip-row">
                      <button type="button" onClick={() => setProveItChoice('ANSWER')}>
                        ANSWER
                      </button>
                      <button type="button" onClick={() => setProveItChoice('ESCALATE')}>
                        ESCALATE
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setProveItChoice(null)
                          setProveItIndex((value) => (value + 1) % proveItScenarios.length)
                        }}
                      >
                        NEXT SCENARIO
                      </button>
                    </div>
                    {proveItChoice && (
                      <div>
                        <p className="meta">YOU SAID: {proveItChoice}</p>
                        <p className="meta">WHAT THE SYSTEM WOULD DO: {selectedScenario.systemDecision}</p>
                        <p className="editorial">WHY: {selectedScenario.why}</p>
                        <p className="meta">SYSTEM PRINCIPLE: {selectedScenario.principle}</p>
                      </div>
                    )}
                  </section>
                )}
              </section>
            )}
          </section>
        )}

        {state.route.mode === 'investigation' && state.route.question === 'how-he-thinks' && (
          <section className="panel" aria-labelledby="thinking-heading">
            <h1 id="thinking-heading">HOW DOES HE THINK?</h1>
            <p className="editorial">WHAT WOULD YOU CHECK FIRST?</p>
            <div className="chip-row">
              {thinkingChoices.map((choice) => (
                <button
                  type="button"
                  key={choice}
                  onClick={() => setThinkingChoice(choice)}
                  aria-pressed={thinkingChoice === choice}
                >
                  {choice}
                </button>
              ))}
            </div>
            {thinkingChoice && (
              <article className="evidence-card">
                <p className="meta">YOU SAID: {thinkingChoice}</p>
                <p className="meta">MANI CHECKED: {maniFirstMove}</p>
                <p className="editorial">
                  {thinkingChoice === maniFirstMove ? 'SAME FIRST MOVE.' : 'DIFFERENT FIRST MOVE.'}
                </p>
                <p className="editorial">
                  Tradeoff: early reproduction isolates variables quickly before logs and patches bias the diagnosis.
                </p>
                <p className="meta">{maniReasoningChain.join(' → ')}</p>
              </article>
            )}
          </section>
        )}

        {state.route.mode === 'investigation' && state.route.question === 'what-different' && (
          <section className="panel" aria-labelledby="different-heading">
            <h1 id="different-heading">WHAT MAKES HIM DIFFERENT?</h1>
            <article className="argument-flow">
              <p className="meta">CLAIM</p>
              <p className="display">I TEST THINGS BEFORE I TRUST THEM.</p>
              <p className="meta">EVIDENCE</p>
              <p className="editorial">276 tests against a fake provider.</p>
              <p className="meta">COUNTEREXAMPLE</p>
              <p className="editorial">The command-substitution bypass still existed.</p>
              <p className="meta">WHAT CHANGED</p>
              <p className="editorial">Validator hardening + stronger regression coverage.</p>
            </article>
          </section>
        )}

        {state.route.mode === 'investigation' && state.route.question === 'what-he-done' && (
          <section className="panel" aria-labelledby="done-heading">
            <h1 id="done-heading">WHAT HAS HE ACTUALLY DONE?</h1>
            <ol className="life-path">
              {lifePath.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p className="editorial">Focus: what changed, not what year it was.</p>
            <div className="chip-row">
              <button
                type="button"
                onClick={() =>
                  navigate({
                    mode: 'investigation',
                    question: 'can-he-build',
                    projectId: 'voice-ai',
                    nodeEvidenceId: 'orange-pi-choice',
                  })
                }
              >
                EDGE INFERENCE DECISION
              </button>
              <button
                type="button"
                onClick={() =>
                  navigate({
                    mode: 'investigation',
                    question: 'can-he-build',
                    projectId: 'friday',
                    nodeEvidenceId: 'friday-validator',
                  })
                }
              >
                VALIDATOR HARDENING
              </button>
            </div>
          </section>
        )}

        {state.route.mode === 'investigation' && state.route.question === 'unexpected' && (
          <section className="panel" aria-labelledby="lab-heading">
            <h1 id="lab-heading">THE LAB</h1>
            <p className="editorial">Curiosity over capability.</p>
            <div className="lab-grid">
              {experiments.map((experiment) => (
                <article key={experiment.id} className="lab-item">
                  <h2>{experiment.name}</h2>
                  <ul>
                    {experiment.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                  {experiment.lesson && <p className="meta">{experiment.lesson}</p>}
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
