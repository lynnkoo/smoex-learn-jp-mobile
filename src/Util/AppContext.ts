import { Channel, Business } from '@ctrip/crn';
import BuildTime from '../BuildTime';
import Utils from './Utils';
import { CHANNEL_TYPE_UNION, CHANNEL_ID } from '../Constants/Platform';

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

  static init = async (props) => {
    Utils.setUserInfo();
    if (props && props.urlQuery) {
      const propsUrl = JSON.parse(JSON.stringify(props.urlQuery).toLowerCase());
      const ubt = await Utils.getUBT();

      // init AppType
      if (propsUrl.AppType) {
        AppContext.CarEnv.AppType = Utils.getAppType(propsUrl.AppType);
      }

      /**
       * init channelId
       * level 1: urlQuery
       * level 2: chennel
       *  */
      if (propsUrl.channelid) {
        AppContext.MarketInfo.channelId = propsUrl.channelid;
      } else if (propsUrl.from === 'car') {
        AppContext.MarketInfo.channelId = CHANNEL_ID.CTRIP_MAIN_APP;
      } else if (propsUrl.s === 'car') {
        AppContext.MarketInfo.channelId = CHANNEL_ID.CTRIP_MAIN_H5;
      } else if (Utils.isZucheApp()) {
        AppContext.MarketInfo.channelId = CHANNEL_ID.ZUCHE;
      } else if (Utils.getChannelName() === CHANNEL_TYPE_UNION.CTRIP) {
        AppContext.MarketInfo.channelId = CHANNEL_ID.CTRIP_DEFAULT;
      }

      // init childChannelId
      if (propsUrl.childchannelid) {
        AppContext.MarketInfo.childChannelId = propsUrl.childchannelid;
      }

      // init sId
      const wakeResult = await Business.getWakeUpDataSync();
      if (propsUrl.sid) {
        AppContext.MarketInfo.sId = propsUrl.sid;
      } else if (wakeResult && wakeResult.awake_sid) {
        AppContext.MarketInfo.sId = wakeResult.awake_sid;
      } else if (ubt.sid) {
        AppContext.MarketInfo.sId = ubt.sid;
      }

      // init aId
      if (propsUrl.allianceid || propsUrl.aid) {
        AppContext.MarketInfo.aId = propsUrl.allianceid || propsUrl.aid;
      } else if (wakeResult && wakeResult.awake_allianceid) {
        AppContext.MarketInfo.aId = wakeResult.awake_allianceid;
      }

      // init visitortraceId
      if (propsUrl.visitortraceid) {
        AppContext.MarketInfo.visitortraceId = propsUrl.visitortraceid;
      }

      // init awakeTime
      if (wakeResult && wakeResult.awake_time) {
        AppContext.MarketInfo.awakeTime = wakeResult.awake_time;
      }
    }
  }
}

export default AppContext;
