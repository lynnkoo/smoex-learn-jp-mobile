import React, { Component } from 'react';
import { App } from '@ctrip/crn';
import { Provider } from 'react-redux';
import pages from './Routers/Index';
import { getStore } from './State/Store';
import { ErrorBoundary } from './Components/Index';
import appLoad from './AppLoad';

const navigationBarConfig = {
  hide: true,
  backgroundColor: 'rgb(9, 159, 222)', // todo: use token value
};

class Car extends App {
  constructor(props) {
    super(props);
    this.init({ pages, navigationBarConfig });
  }
}

export default class RnCarApp extends Component {
  constructor(props) {
    super(props);
    appLoad();
  }

  render() {
    return (
      <ErrorBoundary>
        <Provider store={getStore()}>
          <Car />
        </Provider>
      </ErrorBoundary>
    );
  }
}
