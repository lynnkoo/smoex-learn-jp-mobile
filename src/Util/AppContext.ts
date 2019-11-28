import BuildTime from '../BuildTime';

export interface MarketInfoType {

}

export interface QConfigType {

}

export interface CacheType {

}

export interface CarEnvType {
  BuildTime: string,
  AppType: string,
}

export interface SharkKeysType {

}

export interface ABTestingType {
  trace: string,
  datas: any,
}

const appContext = {
  ABTesting: { trace: '', datas: {} },
  MarketInfo: {},
  QConfig: {},
  Cache: {},
  CarEnv: { BuildTime, AppType: '' },
  SharkKeys: {},
};

const setABTestingFunc = (value) => {
  const datas = { ...appContext.ABTesting.datas, ...value };
  appContext.ABTesting.datas = datas;

  const abTraceStr = [];
  Object.keys(datas).map(m => abTraceStr.push(`${datas[m].ExpCode}|${datas[m].ExpVersion}`));
  appContext.ABTesting.trace = abTraceStr.join(',');
};

const AppContext = {
  get ABTesting(): ABTestingType {
    return appContext.ABTesting;
  },
  setABTesting: setABTestingFunc,
  get MarketInfo(): MarketInfoType {
    return appContext.MarketInfo;
  },
  setMarketInfo: (value) => {
    appContext.MarketInfo = value;
  },
  get QConfig(): QConfigType {
    return appContext.QConfig;
  },
  set QConfig(value) {
    appContext.QConfig = value;
  },
  get Cache(): CacheType {
    return appContext.Cache;
  },
  set Cache(value) {
    appContext.Cache = value;
  },
  get CarEnv(): CarEnvType {
    return appContext.CarEnv;
  },
  set CarEnv(value) {
    appContext.CarEnv = value;
  },
  get SharkKeys(): SharkKeysType {
    return appContext.SharkKeys;
  },
  set SharkKeys(value) {
    appContext.SharkKeys = value;
  },
};

export default AppContext;
