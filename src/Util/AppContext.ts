import { Channel } from '@ctrip/crn';
import _ from 'lodash';

export interface MarketInfoType {
  channelId: string;
  childChannelId: string;
  sId: string;
  aId: string;
  visitortraceId: string;
  awakeTime: string;
}

export interface QConfigType { }

export interface CacheType { }

export interface UserInfoType {
  UserID?: string;
  Auth?: string
}

export interface CarEnvType {
  buildTime: string;
  appType: string;
}

export interface SharkKeysType {
  lang: any,
  messages: any,
}

export interface UrlQueryType {
  age?: string,
  apptype?: any,
  data?: any,
  landingto?: string,
  fromurl?: string,
  st?: string,
}

export interface ABTestingType {
  trace: string,
  datas: any,
}

export interface LanguageInfoType {
  language: string;
  locale: string;
  site: string;
  currency: string;
}

const baseContext = {
  ABTesting: { trace: '', datas: {} },
  MarketInfo: {
    channelId: '',
    childChannelId: '',
    sId: Channel.sId || '',
    aId: Channel.alianceId || '',
    visitortraceId: '',
    awakeTime: '',
  },
  QConfig: {},
  Cache: {},
  CarEnv: { buildTime: '', appType: '' },
  SharkKeys: { lang: {}, messages: {} },
  LanguageInfo: {
    language: '',
    locale: '',
    site: '',
    currency: '',
  },
  UserInfo: {},
  UrlQuery: {},
  Url: '',
  PageInstance: null,
};

const getAppContext = () => _.cloneDeep(baseContext);

let appContext = getAppContext();


const setMarketInfo = (market: MarketInfoType) => {
  appContext.MarketInfo = market;
};

const setABTesting = (value) => {
  const datas = { ...appContext.ABTesting.datas, ...value };
  appContext.ABTesting.datas = datas;

  const abTraceStr = [];
  Object.keys(datas).map(m => abTraceStr.push(`${datas[m].ExpCode}|${datas[m].ExpVersion}`));
  appContext.ABTesting.trace = abTraceStr.join(',');
};

const setUserInfo = (userInfo: any) => {
  const $userInfo = userInfo || {};
  if ($userInfo.data && $userInfo.data.UserId && !$userInfo.data.UserID) {
    // android：uInfo.UserId，ios：uInfo.UserID
    $userInfo.data.UserID = $userInfo.data.UserId;
  }
  appContext.UserInfo = $userInfo.data;
};

const setUrl = (url) => {
  appContext.Url = url;
};

const setUrlQuery = (urlQuery) => {
  appContext.UrlQuery = urlQuery;
};

const setLanguageInfo = (language: LanguageInfoType) => {
  appContext.LanguageInfo = language;
};

const setSharkKeys = (lang, messages) => {
  appContext.SharkKeys.lang = lang;
  appContext.SharkKeys.messages = messages;
};

const resetAppContext = () => {
  appContext = getAppContext();
};

const setPageInstance = (pageInstance) => {
  appContext.PageInstance = pageInstance;
};

const setLanguageCurrency = (currency) => {
  appContext.LanguageInfo.currency = currency;
};

const setCarEnv = (carEnv: CarEnvType) => {
  appContext.CarEnv = carEnv;
};

const AppContext = {
  get ABTesting(): ABTestingType {
    return appContext.ABTesting;
  },
  get MarketInfo(): MarketInfoType {
    return appContext.MarketInfo;
  },
  get QConfig(): QConfigType {
    return appContext.QConfig;
  },
  get Cache(): CacheType {
    return appContext.Cache;
  },
  get CarEnv(): CarEnvType {
    return appContext.CarEnv;
  },
  get SharkKeys(): SharkKeysType {
    return appContext.SharkKeys;
  },
  get LanguageInfo(): LanguageInfoType {
    return appContext.LanguageInfo;
  },
  get UserInfo(): UserInfoType {
    return appContext.UserInfo;
  },
  get Url() {
    return appContext.Url;
  },
  get UrlQuery(): UrlQueryType {
    return appContext.UrlQuery;
  },
  get PageInstance() {
    return appContext.PageInstance;
  },
  resetAppContext,
  setMarketInfo,
  setABTesting,
  setLanguageInfo,
  setUserInfo,
  setUrl,
  setUrlQuery,
  setSharkKeys,
  setPageInstance,
  setLanguageCurrency,
  setCarEnv,
};

export default AppContext;
