import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Replaces a blank page with a message when a render throws. A class component,
 * because React has no hook for `componentDidCatch`.
 */
export default class ErrorBoundary extends Component<Props, State> {
  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  state: State = { error: null };

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Where an error tracker would go.
    console.error('Unhandled render error', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className={'flex h-full flex-col items-center justify-center gap-3 p-8 text-center'}>
        <p className={'text-sm font-medium text-ink'}>Something broke.</p>
        <p className={'max-w-md text-xs text-ink-muted'}>{this.state.error.message}</p>
        <button
          className={
            'rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-on-accent transition hover:opacity-90'
          }
          onClick={() => window.location.reload()}
          type={'button'}
        >
          Reload
        </button>
      </div>
    );
  }
}
