import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { App, LoadingView } from '@ctrip/crn';
import BBkThemingProvider from '@ctrip/bbk-theming';
import pages from './Routers/Index';
import { ErrorBoundary } from './Components/Index';
import appLoad, {
  appPreLoad,
  initialisePropsUrl,
  initialiseChannelId,
  initialiseCarEnv,
} from './AppLoad';
import { initialiseStore, getStore } from './State/Store';
import { getCountryId } from './State/CountryInfo/Selectors';
import AppUnLoad from './AppUnLoad';
import Utils from './Util/Utils';
import { themeLight } from './Pages/List/Theme';

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
  observeCountry: any = null;

  cacheTheme: any = themeLight;

  constructor(props: any) {
    super(props);
    this.state = {
      isPreloadFinished: false,
    };
    this.preLoad(props);
  }

  componentWillUnmount() {
    AppUnLoad();
    this.unSubscribeCountry();
  }

  getTheme() {
    if (!this.cacheTheme) {
      this.cacheTheme = themeLight;
    }
    return this.cacheTheme;
  }

  subscribeCountry = () => {
    this.observeCountry = getStore().subscribe(() => {
      if (getCountryId(getStore().getState())) {
        this.preLoadFinish();
        this.unSubscribeCountry();
      }
    });
  }

  preLoadFinish = () => {
    this.setState({ isPreloadFinished: true });
  }

  unSubscribeCountry = () => {
    if (this.observeCountry) {
      this.observeCountry();
    }
  }

  preLoad = async (props) => {
    // initialise AppContext props
    initialisePropsUrl(props);

    // initialise channelid
    // channelId, childChannelId, visitortraceId
    initialiseChannelId();

    // initialise car environment
    // buildTime, apptype
    initialiseCarEnv();

    // load language
    // load shark
    await appPreLoad();

    // initialise store
    initialiseStore();

    if (Utils.isTrip()) {
      this.subscribeCountry();
      appLoad(props);
    } else {
      this.setState({ isPreloadFinished: true }, () => {
        appLoad(props);
      });
    }
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
            <BBkThemingProvider theme={this.getTheme()}>
              <Car {...this.props} />
            </BBkThemingProvider>
          </Provider>
        </ErrorBoundary>
      );
  }
}
