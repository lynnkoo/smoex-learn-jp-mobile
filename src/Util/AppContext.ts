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

export interface CarEnvType {
  BuildTime: string;
  AppType: string;
}

export interface SharkKeysType { }

export interface UrlQuery {
  age?: string
}

class AppContext {
  static MarketInfo: MarketInfoType = {
    channelId: '',
    childChannelId: '',
    sId: Channel.sId || '',
    aId: Channel.alianceId || '',
    visitortraceId: '',
    awakeTime: '',
  };

  static QConfig: QConfigType = {};

  static Cache: CacheType = {};

  static CarEnv: CarEnvType = { BuildTime, AppType: '' };

  static SharkKeys: SharkKeysType = {};

  static UserInfo = { data: undefined };

  static UrlQuery;

  static Url: string = '';
}

export default AppContext;
