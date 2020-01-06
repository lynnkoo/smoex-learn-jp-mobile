import { IBUSharkUtil, Business } from '@ctrip/crn';
import BbkTranslationKey from '@ctrip/bbk-car-translation-key';
import {
  AppContext, Utils, User, CarStorage,
} from './Util/Index';
import { initialiseAppState } from './State/Store';
import { initialiseABTesting } from './Util/ABTesting';
import { Platform } from './Constants/Index';
import { CHANNEL_ID, CHANNEL_TYPE_UNION } from './Constants/Platform';
import StorageKey from './Constants/StorageKey';
import BuildTime from './BuildTime';
import CarI18n from './Util/CarI18n';
import Locale from './Util/Locale';
import DebugLog from './Util/DebugLog';

const initialisePropsUrl = (props: any) => {
  const { url, urlQuery } = props;
  AppContext.setUrl(url);
  AppContext.setUrlQuery(urlQuery);
};

// initialise car environment
// buildTime, apptype
const initialiseCarEnv = () => {
  AppContext.setCarEnv({
    buildTime: BuildTime,
    appType: Utils.getAppType(AppContext.UrlQuery.apptype),
  });
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

  if (!id && from === 'car') id = CHANNEL_ID.CTRIP_MAIN_APP;

  if (!id && s === 'car') id = CHANNEL_ID.CTRIP_MAIN_H5;

  if (!id && Utils.isZucheApp()) id = CHANNEL_ID.ZUCHE;

  if (!id && Utils.getChannelName() === CHANNEL_TYPE_UNION.CTRIP) {
    id = CHANNEL_ID.CTRIP_DEFAULT;
  }

  if (!id && Utils.isTrip()) id = CHANNEL_ID.IBU_DEFAULT;

  if (!id) id = CHANNEL_ID.CTRIP_DEFAULT;

  return id;
};

const getAidSidWakeUpData = async (props) => {
  let sidValue = '';
  let aidValue = '';
  let awakeTime = '';
  /* eslint-disable camelcase */
  // @ts-ignore
  const { awake_sid, awake_allianceid, awake_time } = await Business.getWakeUpDataPromise();

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

// initialise channelid
// channelId, childChannelId, visitortraceId
const initialiseChannelId = () => {
  const propsUrl = Utils.convertKeysToLowerCase(AppContext.UrlQuery);
  const { childchannelid, visitortraceid } = propsUrl;
  AppContext.setMarketInfo({
    channelId: getChannelId(propsUrl),
    childChannelId: childchannelid || '',
    visitortraceId: visitortraceid || '',
    sId: '',
    aId: '',
    awakeTime: '',
  });
};

// initialise market
// aid, sid, awake_time, visitortraceId
const initialiseMarket = async () => {
  const propsUrl = Utils.convertKeysToLowerCase(AppContext.UrlQuery);
  const { sId, aId, awakeTime } = await getAidSidWakeUpData(propsUrl);
  const { channelId, childChannelId, visitortraceId } = AppContext.MarketInfo;
  AppContext.setMarketInfo({
    channelId,
    childChannelId,
    visitortraceId,
    sId,
    aId,
    awakeTime,
  });
};

const appLoad = async (props: any) => {
  // initialise UserInfo
  User.isLogin();

  initialiseMarket();
  initialiseStorage(props);
  initialiseABTesting();
  initialiseAppState();
};

/* eslint-disable class-methods-use-this */
const getSharkConfig = () => ({
  appid: Platform.SHARK_APP_ID.TRIP,
  keys: { ...BbkTranslationKey },
});

const loadSharkData = async () => {
  if (IBUSharkUtil && IBUSharkUtil.fetchSharkData) {
    return IBUSharkUtil.fetchSharkData(getSharkConfig())
      .then(({ lang, messages }) => ({ lang, messages }))
      .catch(() => ({ lang: '', messages: {} }));
  }
  return { lang: '', messages: {} };
};

const appPreLoad = async () => {
  const label = 'loadLanguageAsync';
  DebugLog.time(label);

  const task = await Promise.all([
    CarI18n.getCurrentLocale(),
    CarI18n.getCurrentCurrency('callback'),
    loadSharkData(),
  ]);

  const [currentLocale, currentCurrency, sharkKeys] = task;
  const localeInstance = new Locale(currentLocale.locale);
  const locale = localeInstance.getLocale();
  const language = localeInstance.getLanguage().toLowerCase();

  DebugLog.timeEnd(label);

  AppContext.setSharkKeys(sharkKeys.lang, sharkKeys.messages);
  AppContext.setLanguageInfo({
    locale,
    site: language,
    currency: currentCurrency ? currentCurrency.code : '',
    language,
  });
};

export {
  appPreLoad,
  initialisePropsUrl,
  initialiseChannelId,
  initialiseCarEnv,
};
export default appLoad;
