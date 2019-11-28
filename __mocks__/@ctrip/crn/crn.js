/* eslint-disable */
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';

configure({ adapter: new Adapter() });

jest.useFakeTimers();

jest.mock('@ctrip/crn', () => {
  const __Storage__ = {};

  const react = require('react');

  return {
    Page: react.Component,
    Application: {
      version: '8.3.0',
    },
    Channel: {
      sId: '',
      alianceId: '',
    },
    I18n: {
      getCurrentLocale: () => { }
    },
    Device: {
      setStatusBarStyle() { },
      deviceInfo: {
        IP: '',
        OS: '苹果',
        account: '_winon15000000001',
        areaCode: '',
        baseStation: '',
        clientID: '12001080510000163735',
        latitude: 37.78583526611328,
        longitude: -122.40641784667969,
        mac: '78:7B:8A:CC:6F:C3',
        port: '',
        wifiMac: '',
      },
      deviceName: 'iPhone 8',
      deviceType: 'iPhone 8_Simulator',
      idfa: '50C89F01-111F-4A84-BFA6-B46BCC549E6E',
      idfv: 'D1DE36B3-3EB6-40FB-8D0A-74CD91E11CA5',
      isJailBreak: false,
      isPad: false,
      isiPhoneX: false,
      osVersion: 'iOS_12.4',
      screenHeight: 667,
      screenWidth: 375,
      getAppsInstallStatus() { },
    },
    Event: {
      addEventListener: (event, callback) => { },
      removeEventListener: event => { },
      sendEvent: (event, eventinfo) => { },
    },
    lazyRequire() { },
    Location: {
      locate: () => {
        return Promise.resolve({});
      },
    },
    ABTesting: {
      getABTestingInfo: (name, a, callback) => {
        setTimeout(callback, 0);
      },
    },
    Log: {
      logCode: (key, obj) => {
        return {
          key,
          obj,
        };
      },
      logTrace: (key, obj) => {
        return {
          key,
          obj,
        };
      },
      logMetric() { },
    },
    Share: {
      customShare: (/*obj, callback */) => {
        return '';
      },
    },
    User: {
      getUserInfo: function (callback) {
        setTimeout(() => {
          callback(0, null);
        });
      },
    },
    Storage: {
      // mock @ctrip/crn Storage Object
      load: function (params, callback) {
        setTimeout(function () {
          callback(__Storage__[params.domain] && __Storage__[params.domain][params.key]);
        }, 0);
      },
      save: function (params) {
        if (typeof __Storage__[params.domain] === 'undefined') {
          __Storage__[params.domain] = {};
        }
        __Storage__[params.domain][params.key] = params.value;
      },
    },
    // Animated: Animated,//require.requireActual('Animated'),
    fetch: function (url, params) {
      // Fake Fetch Method
      return new Promise((resolve, reject) => {
        if (params.body) {
          if (params.body.reject) {
            // 模拟Fetch失败的
            reject();
            return;
          }

          if (params.body.soa) {
            // 模拟SOA接口返回出错
            resolve({ ResponseStatus: { Ack: 'Error' } });
            return;
          }

          if (params.body.mockResponse) {
            resolve(params.body.mockResponse);
            return;
          }
        }

        resolve({});
      });
    },
    cancelFetch: () => { },
    Platform: {
      OS: 'ios',
    },
    URL: {
      openURL: () => { },
    },
    MapView: {},
    Bridge: {
      callNativeWithCallback: (pluginName, type, obj, callback) => {
        callback();
      },
    },
    LinearGradient: () => null,
    LottieAnimation: () => { },
    Button: TouchableOpacity,//require.requireActual('Button'),
    Env: {
      getEnvType: callback => {
        const env = 'prd';
        // let env = Application.env || 'prd'
        callback && callback(env);
        return env;
      },
      getNetworkType: () => {
        return 'WIFI';
      },
    },
    Toast: {
      show: () => { },
    },
    Loading: {
      showMaskLoading: () => { },
      hideMaskLoading: () => { },
    },
    BlurView: react.Component,
    HeaderView: View,
    ViewPort: View,
    RefreshControl: react.Component,
    ScrollView: react.Component,
    HtmlText: props => {
      return <View>{props && props.html}</View>;
    },
  };
});
