import React, { Component } from 'react';
// import { Text } from 'react-native';
import { Provider } from 'react-redux';
// import { IntlProvider } from 'react-intl';
import { App, LoadingView } from '@ctrip/crn';
import BBkThemingProvider from '@ctrip/bbk-theming';
import BbkChannel from '@ctrip/bbk-utils';
import pages from './Routers/Index';
import { getStore } from './State/Store';
import { ErrorBoundary } from './Components/Index';
import appLoad, { loadLanguageAndSharkAsync } from './AppLoad';
import { APP_ID } from './Constants/Platform';
// import { AppContext } from './Util/Index';
import AppUnLoad from './AppUnLoad';

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
      await loadLanguageAndSharkAsync();
    }
    appLoad(props);
    this.setState({ isPreloadFinished: true });
  };

  render() {
    const { isPreloadFinished } = this.state;
    return !isPreloadFinished
      ? (
        <LoadingView />
      )
      : (
        <ErrorBoundary>
          <Provider store={getStore()}>
            <BBkThemingProvider channel={BbkChannel.getChannel()}>
              {/* <IntlProvider
                locale={AppContext.SharkKeys.lang}
                messages={AppContext.SharkKeys.messages}
                textComponent={Text}
              > */}
              <Car {...this.props} />
              {/* </IntlProvider> */}
            </BBkThemingProvider>
          </Provider>
        </ErrorBoundary>
      );
  }
}
