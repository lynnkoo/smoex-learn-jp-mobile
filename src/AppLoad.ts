import { Business, Util } from '@ctrip/crn';
import {
  AppContext, MarketInfoType, Utils, User, CarStorage,
} from './Util/Index';
import { initialiseStore, initialiseAppState } from './State/Store';
import { initialiseABTesting } from './Util/ABTesting';
import { CHANNEL_ID, CHANNEL_TYPE_UNION } from './Constants/Platform';
import StorageKey from './Constants/StorageKey';
import { Language } from './Constants/Index';
import BuildTime from './BuildTime';
import CarI18n from './Util/CarI18n';
import Locale from './Util/Locale';
import DebugLog from './Util/DebugLog';

const initialisePropsUrl = (props) => {
  const { url, urlQuery } = props;
  AppContext.setUrl(url);
  AppContext.setUrlQuery(urlQuery);
};

const initialiseStorage = ({ urlQuery }) => {
  // debug model
  if (urlQuery && urlQuery.debug === 'true') {
    CarStorage.save(StorageKey.DEBUG, 'true');
  }
};

const getChannelId = ({ channelid, from, s }) => {
  /**
     * init channelId
     * level 1: urlQuery
     * level 2: chennel
     *  */
  let id = '';

  if (channelid) id = channelid;

  if (!channelid && from === 'car') id = CHANNEL_ID.CTRIP_MAIN_APP;

  if (!channelid && s === 'car') id = CHANNEL_ID.CTRIP_MAIN_H5;

  if (!channelid && Utils.isZucheApp()) id = CHANNEL_ID.ZUCHE;

  if (!channelid && Utils.getChannelName() === CHANNEL_TYPE_UNION.CTRIP) {
    id = CHANNEL_ID.CTRIP_DEFAULT;
  }

  if (!channelid && Utils.isTrip()) id = CHANNEL_ID.IBU_DEFAULT;

  return id;
};

const getAidSidWakeUpData = (props) => {
  let sidValue = '';
  let aidValue = '';
  let awakeTime = '';
  /* eslint-disable camelcase */
  const { awake_sid, awake_allianceid, awake_time } = Util.isInChromeDebug
    ? { awake_sid: '', awake_allianceid: '', awake_time: '' }
    : Business.getWakeUpDataSync();

  if (props.sid) sidValue = props.sid;

  if (!sidValue && awake_sid) {
    sidValue = awake_sid;
  }

  if (!sidValue) {
    const { sid } = Utils.getUBT();
    sidValue = sid;
  }

  if (props.allianceid || props.aid) {
    aidValue = props.allianceid || props.aid;
  }

  if (!aidValue && awake_allianceid) {
    aidValue = awake_allianceid;
  }

  if (!awake_time) awakeTime = awake_time;

  return {
    sId: sidValue,
    aId: aidValue,
    awakeTime,
  };
};

const getMarket = (): MarketInfoType => {
  const propsUrl = Utils.convertKeysToLowerCase(AppContext.UrlQuery);
  const { childchannelid, visitortraceid } = propsUrl;
  const { sId, aId, awakeTime } = getAidSidWakeUpData(propsUrl);
  return {
    channelId: getChannelId(propsUrl),
    childChannelId: childchannelid || '',
    visitortraceId: visitortraceid || '',
    sId,
    aId,
    awakeTime,
  };
};

const initialiseAppContext = async () => {
  // initialise UserInfo
  User.isLogin();

  // initialise car environment
  // buildTime, apptype
  AppContext.setCarEnv({
    buildTime: BuildTime,
    appType: Utils.getAppType(AppContext.UrlQuery.apptype),
  });

  // initialise market
  // aid, sid, awake_time, visitortraceId
  AppContext.setMarketInfo(getMarket());
};

const appLoad = (props: any) => {
  initialisePropsUrl(props);
  initialiseAppContext();
  initialiseStore();
  initialiseStorage(props);
  initialiseABTesting();
  initialiseAppState();
};

const loadLanguageAsync = async () => {
  const label = 'loadLanguageAsync';
  DebugLog.time(label);

  const task = await Promise.all([
    CarI18n.getCurrentLocale(),
    CarI18n.getCurrentCurrency('callback'),
  ]);
  const [currentLocale, currentCurrency] = task;
  const localeInstance = new Locale(currentLocale.locale);
  const locale = localeInstance.getLocale();
  const language = localeInstance.getLanguage().toUpperCase();
  const localeLanguage = [Language.HK, Language.TW].includes(language) ? Language.CN : language;
  DebugLog.timeEnd(label);

  return {
    locale,
    site: language,
    currency: currentCurrency ? currentCurrency.code : '',
    language: localeLanguage,
  };
};

export { loadLanguageAsync };
export default appLoad;
