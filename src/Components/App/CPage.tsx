// http://conf.ctripcorp.com/pages/viewpage.action?pageId=154603234
import React from 'react';
import {
  Page,
  ViewPort,
  LoadingView,
  IBUSharkUtil,
  IBasePageProps,
} from '@ctrip/crn';
// import { IntlProvider } from 'react-intl';
// import { Text } from 'react-native';
import { AppContext, CarLog } from '../../Util/Index';
import { Platform, TranslationKeys } from '../../Constants/Index';

export interface IStateType {
  lang?: string,
  messages?: any,
}

export default class CPage<P extends IBasePageProps, S extends IStateType> extends Page<P, S> {
  constructor(prop: P) {
    super(prop);
    // this.state = {
    //   lang: '',
    //   messages: null,
    // };
  }

  async getPVOption() {
    const logBasicInfo = await CarLog.logBasicInfo();
    return {
      ...logBasicInfo,
    };
  }

  componentDidMount() {
    if (IBUSharkUtil && IBUSharkUtil.fetchSharkData) {
      // const startTime = new Date().getTime();
      IBUSharkUtil.fetchSharkData(this.getSharkConfig())
        .then(({ lang, messages }) => {debugger;
          this.setAppContextSharkKeys(lang, messages);
          this.setState({ lang, messages });
          this.sharkFetchDidFinish();
          // const costTime = new Date().getTime() - startTime;
          // IBULog.trace("key.crn.ibupage.load.keys.time", {
          //   keys_time: costTime
          // });
        })
        .catch(() => {debugger;
          this.setAppContextSharkKeys('', {});
          this.setState({ lang: '', messages: {} });
          this.sharkFetchDidFinish();
        });
    } else {
      this.setAppContextSharkKeys('', {});
      this.setState({ lang: '', messages: {} });
      this.sharkFetchDidFinish();
    }
  }

  componentWillUnmount() { }

  /* eslint-disable class-methods-use-this */
  sharkFetchDidFinish() {
  }

  setAppContextSharkKeys(lang, messages) {
    AppContext.SharkKeys = { lang, messages };
  }

  /* eslint-disable class-methods-use-this */
  getSharkConfig() {
    return {
      appid: Platform.SHARK_APP_ID.TRIP,
      keys: { ...TranslationKeys },
    };
  }

  getLoadingState() {
    return false;
  }

  renderPageLoading() {
    return (
      <ViewPort>
        <LoadingView />
      </ViewPort>
    );
  }

  renderPageContent() {
    return <ViewPort />;
  }

  render() {
    // const { lang, messages } = this.state;
    // const loading = this.getLoadingState();
    return this.renderPageContent();
    // if (lang && messages && !loading) {
    // return (
    // <IntlProvider locale={lang} messages={messages} textComponent={Text}>
    // {this.renderPageContent()}
    // </IntlProvider>
    // );
    // }
    // return this.renderPageLoading();
  }
}
