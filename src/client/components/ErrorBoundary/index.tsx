import React from 'react';
import { ErrorBoundaryProps } from './PropsType';

export interface StateType {}
class ErrorBoundary extends React.Component<ErrorBoundaryProps, StateType> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
    console.log('this.props.children', this.props.children);
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
