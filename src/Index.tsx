import React, { Component } from 'react';
import { App } from '@ctrip/crn';
import pages from './Routers/Index';
import { AppContext, Utils } from './Util/Index';

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
    this.initAppContext();
  }

  initAppContext = () => {
    AppContext.CarEnv.AppType = Utils.getAppType();
  }

  render() {
    return (
      // <Provider store={store}>
      <Car />
      // </Provider>
    );
  }
}
