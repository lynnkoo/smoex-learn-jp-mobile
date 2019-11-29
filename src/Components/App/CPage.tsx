// http://conf.ctripcorp.com/pages/viewpage.action?pageId=154603234
import React from 'react';
import {
  Page,
  ViewPort,
  LoadingView,
  IBUSharkUtil,
  IBasePageProps,
} from '@ctrip/crn';
import { IntlProvider } from 'react-intl';
import { Text } from 'react-native';
import { AppContext, CarLog } from '../../Util/Index';
import { Platform, TranslationKeys, LogKey } from '../../Constants/Index';

export interface IStateType {
  lang?: string,
  messages?: any,
}

export default class CPage<P extends IBasePageProps, S extends IStateType> extends Page<P, S> {
  pageInitialiseTime: Date = null;
  pageLastActiveTime: Date = null;
  pageAppearCount: Number = null;
  isPageAppear: Boolean = true;

  constructor(prop: P) {
    super(prop);
    this.pageInitialiseTime = new Date();
    this.pageLastActiveTime = new Date();
    this.pageAppearCount = 0;
    // this.state = {
    //   lang: '',
    //   messages: null,
    // };
  }

  getPVOption() {
    return {
      ...CarLog.logBasicInfo()
    };
  }

  pageDidAppear() {
    this.pageLastActiveTime = new Date();
    this.isPageAppear = true;
  }

  pageDidDisappear() {
    const activeTime = +new Date() - +this.pageLastActiveTime;
    this.isPageAppear = false;
    CarLog.LogMetric({ key: LogKey.METRIC_PAGE_ACTIVE_TIME, value: activeTime, info: {} });
  }

  push(name) {
    super.push(name);
  }

  pop(name) {
    super.pop(name);
  }

  componentDidMount() {
    if (IBUSharkUtil && IBUSharkUtil.fetchSharkData) {
      IBUSharkUtil.fetchSharkData(this.getSharkConfig())
        .then(({ lang, messages }) => {
          debugger;
          this.setAppContextSharkKeys(lang, messages);
          this.setState({ lang, messages });
          this.sharkFetchDidFinish();
        })
        .catch(() => {
          debugger;
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
    AppContext.setSharkKeys(lang, messages);
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
    const { lang, messages } = this.state;
    const loading = this.getLoadingState();
    if (lang && messages && !loading) {
      return (
        <IntlProvider locale={lang} messages={messages} textComponent={Text}>
          {this.renderPageContent()}
        </IntlProvider>
      );
    }
    return this.renderPageLoading();
  }
}