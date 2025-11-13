import React from 'react'

interface State {
  error: Error | null
  info: React.ErrorInfo | null
}

export default class ErrorBoundary extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props)
    this.state = { error: null, info: null }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // log to console — helpful during development
    // eslint-disable-next-line no-console
    console.error('Uncaught render error:', error, info)
    this.setState({ error, info })
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-dark-primary p-6">
          <div className="max-w-3xl w-full bg-dark-secondary rounded-lg border border-gray-800 p-6">
            <h2 className="text-xl font-bold text-red-400 mb-2">Something went wrong</h2>
            <pre className="text-sm text-gray-300 whitespace-pre-wrap">{String(this.state.error)}</pre>
            <details className="text-xs text-gray-400 mt-4">
              <summary>Stack trace</summary>
              <pre className="text-xs text-gray-400 whitespace-pre-wrap">{this.state.info?.componentStack}</pre>
            </details>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
