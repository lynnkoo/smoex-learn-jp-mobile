import { Business } from '@ctrip/crn';
import { AppContext, Utils, User } from './Util/Index';
import { initialiseStore, initialiseAppState } from './State/Store';
import { CHANNEL_ID, CHANNEL_TYPE_UNION } from './Constants/Platform';

const initialisePropsUrl = (props) => {
  const { url, urlQuery } = props;
  AppContext.Url = url;
  AppContext.UrlQuery = urlQuery;
};

const initialiseAppContext = async () => {
  // init languageInfo
  AppContext.initLanguageInfo();

  // init UserInfo
  User.isLogin();

  // init AppType
  if (AppContext.UrlQuery.AppType) {
    AppContext.CarEnv.AppType = Utils.getAppType(AppContext.UrlQuery.AppType);
  }

  const propsUrl = Utils.convertKeysToLowerCase(AppContext.UrlQuery);
  const ubt = await Utils.getUBT();

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
};

const appLoad = (props) => {
  initialisePropsUrl(props);
  initialiseStore();
  initialiseAppState();
  initialiseAppContext();
};

export default appLoad;
