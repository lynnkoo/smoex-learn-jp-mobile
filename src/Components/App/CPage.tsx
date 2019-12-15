// http://conf.ctripcorp.com/pages/viewpage.action?pageId=154603234
import React, {createContext, ContextType} from 'react';
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
import AppUnLoad from '../../AppUnLoad';
import BbkTranslationKey from '@ctrip/bbk-car-translation-key'

export interface IStateType {
  lang?: string,
  messages?: any,
}

export default class CPage<P extends IBasePageProps, S extends IStateType> extends Page<P, S> {
  pageInitialiseTime: Date = null;
  pageLastActiveTime: Date = null;
  pageShowTime: Date = null;
  pageAppearCount: Number = null;
  isPageAppear: Boolean = true;

  constructor(prop: P) {
    super(prop);
    this.pageInitialiseTime = new Date();
    this.pageLastActiveTime = new Date();
    this.pageAppearCount = 0;
    AppContext.setPageInstance(this);
    // this.state = {
    //   lang: '',
    //   messages: null,
    // };
  }

  getPageId() {
    return '';
  }

  getPVOption() {
    return {
      ...CarLog.logBasicInfo()
    };
  }

  pageDidAppear() {
    // 第一次初始化时不会调用
    AppContext.setPageInstance(this);
    this.pageLastActiveTime = new Date();
    this.isPageAppear = true;
  }

  pageDidDisappear() {
    const activeTime = +new Date() - +this.pageLastActiveTime;
    this.isPageAppear = false;
    CarLog.LogMetric({ key: LogKey.METRIC_PAGE_ACTIVE_TIME, value: activeTime, info: { pageId: this.getPageId() } });
  }

  push(name, ...args) {
    super.push(name, args);
  }

  pop(name) {
    super.pop(name);
  }

  replace(name) {
    super.replace(name);
  }

  componentDidMount() {
    this.pageShowTime = new Date();
    if (IBUSharkUtil && IBUSharkUtil.fetchSharkData) {
      IBUSharkUtil.fetchSharkData(this.getSharkConfig())
        .then(({ lang, messages }) => {
          this.setAppContextSharkKeys(lang, messages);
          this.setState({ lang, messages });
          this.sharkFetchDidFinish();
        })
        .catch(() => {
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

  componentWillUnmount() {
    AppUnLoad();
  }

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
      keys: { ...BbkTranslationKey },
    };
  }

  getLoadingState() {
    return false;
  }

  logPagePerformance() {
    const interactiveTime = +new Date() - +this.pageLastActiveTime;
    CarLog.LogMetric({ key: LogKey.METRIC_PAGE_INTERACTIVE_TIME, value: interactiveTime, info: { pageId: this.getPageId() } });
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
