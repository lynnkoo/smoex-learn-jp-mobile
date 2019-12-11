import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { App } from '@ctrip/crn';
import { BbkChannel } from '@ctrip/bbk-utils';
import pages from './Routers/Index';
import { getStore } from './State/Store';
import { ErrorBoundary } from './Components/Index';
import appLoad from './AppLoad';

// @ts-ignore
if (global.__crn_appId === '37') { // eslint-disable-line
  BbkChannel.setChannel('TRIP');
} else {
  BbkChannel.setChannel('CTRIP');
}

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
    appLoad(props);
  }

  render() {
    return (
      <ErrorBoundary>
        <Provider store={getStore()}>
          <Car {...this.props} />
        </Provider>
      </ErrorBoundary>
    );
  }
}
