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

export interface UserInfo {
}

export interface CarEnvType {
  BuildTime: string;
  AppType: string;
}

export interface SharkKeysType { }

export interface UrlQuery {
  age?: string
}

export interface LanguageInfoType {
  language: string;
  locale: string;
  site: string;
  currency: string;
}


class AppContext {
  MarketInfo: MarketInfoType = {
    channelId: '',
    childChannelId: '',
    sId: Channel.sId || '',
    aId: Channel.alianceId || '',
    visitortraceId: '',
    awakeTime: '',
  };

  QConfig: QConfigType = {};

  Cache: CacheType = {};

  CarEnv: CarEnvType = { BuildTime, AppType: '' };

  SharkKeys: SharkKeysType = {};

  UrlQuery;

  Url: string = '';

  $UserInfo: UserInfo = {};

  LanguageInfo: LanguageInfoType = {
    language: '',
    locale: '',
    site: '',
    currency: '',
  };

  get UserInfo() {
    return this.$UserInfo;
  }

  set UserInfo(userInfo: any) {
    const $userInfo = userInfo || {};
    if ($userInfo.data && $userInfo.data.UserId && !$userInfo.data.UserID) {
      // android：uInfo.UserId，ios：uInfo.UserID
      $userInfo.data.UserID = $userInfo.data.UserId;
    }
    this.$UserInfo = $userInfo.data;
  }

  initLanguageInfo = async () => {
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
  }
}

export default new AppContext();
