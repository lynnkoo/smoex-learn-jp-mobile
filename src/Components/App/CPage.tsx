// http://conf.ctripcorp.com/pages/viewpage.action?pageId=154603234
import React from 'react';
import { StatusBar } from 'react-native';
import {
  Page,
  IBasePageProps,
} from '@ctrip/crn';
import { AppContext, CarLog, Utils } from '../../Util/Index';
import { LogKey } from '../../Constants/Index';
import { color } from '@ctrip/bbk-tokens';

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

  pop(name?: string, info?: any) {
    super.pop(name, info);
  }

  replace(name) {
    super.replace(name);
  }

  componentDidMount() {
    this.pageShowTime = new Date();
    if (Utils.isAndroid) {
      // 安卓沉浸式状态栏
      StatusBar.setBackgroundColor(color.transparent, false);
      StatusBar.setTranslucent(true);
      StatusBar.setBarStyle('dark-content');
    }
  }

  disableNavigatorDragBack() {
    CPage.disableNativeDragBack();
  }

  enableNavigatorDragBack() {
    CPage.enableNativeDragBack();
  }

  logPagePerformance() {
    const interactiveTime = +new Date() - +this.pageLastActiveTime;
    CarLog.LogMetric({ key: LogKey.METRIC_PAGE_INTERACTIVE_TIME, value: interactiveTime, info: { pageId: this.getPageId() } });
  }
}
