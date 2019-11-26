import React, { ReactNode } from 'react';

interface PropsType {
  children?: ReactNode
}
export default class ErrorBoundary extends React.Component<PropsType> {
  // log error
  // componentDidCatch(error, errorInfo) {
  //   console.error(error, errorInfo);
  // }

  render() {
    const { children } = this.props;
    return children;
  }
}
