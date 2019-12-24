import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { App, LoadingView } from '@ctrip/crn';
import BBkThemingProvider from '@ctrip/bbk-theming';
import BbkChannel from '@ctrip/bbk-utils';
import pages from './Routers/Index';
import { getStore } from './State/Store';
import { ErrorBoundary } from './Components/Index';
import appLoad, { loadLanguageAsync } from './AppLoad';
import AppUnLoad from './AppUnLoad';
import { APP_ID } from './Constants/Platform';
import { AppContext } from './Util/Index';

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

interface StateType {
  isPreloadFinished: boolean,
}
export default class RnCarApp extends Component<any, StateType> {
  constructor(props: any) {
    super(props);
    this.state = {
      isPreloadFinished: false,
    };
    this.preLoad(props);
  }

  componentWillUnmount() {
    AppUnLoad();
  }

  preLoad = async (props) => {
    /* eslint-disable dot-notation */
    if (global['__crn_appId'] === APP_ID.TRIP) {
      const language = await loadLanguageAsync();
      AppContext.setLanguageInfo(language);
    }
    appLoad(props);
    this.setState({ isPreloadFinished: true });
  };

  render() {
    return !this.state.isPreloadFinished
      ? (
        <LoadingView />
      )
      : (
        <ErrorBoundary>
          <Provider store={getStore()}>
            <BBkThemingProvider channel={BbkChannel.getChannel()}>
              <Car {...this.props} />
            </BBkThemingProvider>
          </Provider>
        </ErrorBoundary>
      );
  }
}
