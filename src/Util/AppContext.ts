import { Channel } from '@ctrip/crn';
import BuildTime from '../BuildTime';
import CarI18n from './CarI18n';
import Locale from './Locale';
import { APP_ID } from '../Constants/Platform';

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
}

export interface CarEnvType {
  BuildTime: string;
  AppType: string;
}

export interface SharkKeysType { }

export interface UrlQueryType {
  age?: string,
  AppType?: any,
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

const appContext = {
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
  CarEnv: { BuildTime, AppType: '' },
  SharkKeys: {},
  LanguageInfo: {
    language: '',
    locale: '',
    site: '',
    currency: '',
  },
  UserInfo: {},
  UrlQuery: {},
  Url: '',
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

const initLanguage = async () => {
  /* eslint-disable dot-notation */
  if (global['__crn_appId'] === APP_ID.TRIP) {
    const { locale } = await CarI18n.getCurrentLocale();
    const { code: currency } = await CarI18n.getCurrentCurrency('callback');
    const localeInstance = new Locale(locale);
    let language = localeInstance.getLanguage().toUpperCase();
    const traditional = ['hk', 'tw'];
    // 如果是香港台湾等类中文语言，统一传 CN
    if (traditional.includes(language)) {
      language = 'CN';
    }
    this.LanguageInfo = {
      language,
      locale: localeInstance.getLocale(),
      site: language,
      currency,
    };
  }
};

const AppContext = {
  get ABTesting(): ABTestingType {
    return appContext.ABTesting;
  },
  get MarketInfo(): MarketInfoType {
    return appContext.MarketInfo;
  },
  setMarketInfo: (value) => {
    appContext.MarketInfo = value;
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
  setABTesting,
  initLanguageInfo: initLanguage,
  setUserInfo,
  setUrl,
  setUrlQuery,
};

export default AppContext;
