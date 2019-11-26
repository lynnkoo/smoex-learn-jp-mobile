import React from 'react';
export default class ErrorBoundary extends React.Component {
    // log error
    // componentDidCatch(error, errorInfo) {
    //   console.error(error, errorInfo);
    // }
    render() {
        const { children } = this.props;
        return children;
    }
}
