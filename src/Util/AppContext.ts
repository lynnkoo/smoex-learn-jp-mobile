import { Channel } from '@ctrip/crn';
import BuildTime from '../BuildTime';

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
}

export default new AppContext();
