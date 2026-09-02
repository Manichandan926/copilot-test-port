import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false }

  public static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  public componentDidCatch(_error: Error, _errorInfo: ErrorInfo): void {
    // Intentionally silent in UI; avoid exposing stack traces.
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <section className="thread-broken" aria-live="polite">
          <p className="meta">THIS THREAD BROKE.</p>
          <button
            type="button"
            onClick={() => {
              this.setState({ hasError: false })
              window.location.hash = ''
            }}
          >
            RETURN TO INVESTIGATION →
          </button>
        </section>
      )
    }

    return this.props.children
  }
}
