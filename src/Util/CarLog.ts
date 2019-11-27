import { Channel, Application, Log } from '@ctrip/crn';
import moment from 'moment';
import Utils from './Utils';
import AppContext from './AppContext';
import CarI18n from './CarI18n';
import Locale from './Locale';
import { getStore } from '../State/Store';
import {
  AgeConfig, ClickKey, LogKey, Platform,
} from '../Constants/Index';

export interface LogCodeType {
  pageId: string,
  enName: string,
  name?: string
}

export interface LogTraceType {
  key: string,
  info?: any
}

export interface LogMetricType {
  key: string,
  value: number,
  info?: any
}

class CarLog {
  // Get the return time and location information
  static getLocationAndDateInfo = () => {
    const state = getStore().getState();
    const { countryId, countryCode, countryName } = state.CountryInfoReducer;
    const { rentalLocation, rentalDate } = state.LocationAndDateReducer;
    const pickupTime = moment(rentalDate.pickUp.dateTime, moment.ISO_8601).format(
      'YYYY-MM-DD HH:mm:ss',
    );
    const dropOffTime = moment(rentalDate.dropOff.dateTime, moment.ISO_8601).format(
      'YYYY-MM-DD HH:mm:ss',
    );
    return {
      pickupCityId: rentalLocation.pickUp.cid,
      pickupCityName: rentalLocation.pickUp.cname,
      pickupLocationCode: rentalLocation.pickUp.area.id,
      pickupLocationType: rentalLocation.pickUp.area.type,
      pickupLocationName: rentalLocation.pickUp.area.name,
      pickupDateTime: pickupTime,
      dropOffCityId: rentalLocation.dropOff.cid,
      dropOffCityName: rentalLocation.dropOff.cname,
      dropOffLocationCode: rentalLocation.dropOff.area.id,
      dropOffLocationType: rentalLocation.dropOff.area.type,
      dropOffLocationName: rentalLocation.dropOff.area.name,
      dropOffDateTime: dropOffTime,
      isOneWay: rentalLocation.isOneWay,
      isSendCar: '2',
      isPickupCar: '2',
      residency: `${countryId}` || '66',
      countryCode,
      countryName,
    };
  }

  // Get language and currency information
  static getLanguageInfo = async () => {
    if (Utils.getChannelName() === Platform.CHANNEL_TYPE_UNION.CTRIP) {
      return {
        language: '',
        locale: '',
        site: '',
        currency: '',
      };
    }
    const { locale } = await CarI18n.getCurrentLocale();
    const { code: currency } = await CarI18n.getCurrentCurrency('callback');
    const localeInstance = new Locale(locale);
    let language = localeInstance.getLanguage().toUpperCase();
    const traditional = ['hk', 'tw'];
    // 如果是香港台湾等类中文语言，统一传 CN
    if (traditional.includes(language)) {
      language = 'CN';
    }

    return {
      language,
      locale: localeInstance.getLocale(),
      site: language,
      currency,
    };
  }

  static logBasicInfo = async () => {
    const languageInfo = await CarLog.getLanguageInfo();
    const locationAndDateInfo = await CarLog.getLocationAndDateInfo();
    const curDate = new Date();
    const state = getStore().getState();
    const { age } = state.AgeReducer;
    return {
      sourceFrom: AppContext.CarEnv.AppType,
      businessType: Utils.getBusinessType(),
      distibutionChannelId: Utils.isQunarApp() ? AppContext.MarketInfo.childChannelId : AppContext.MarketInfo.channelId,
      channelId: Utils.isQunarApp() ? AppContext.MarketInfo.channelId : AppContext.MarketInfo.childChannelId,
      sId: AppContext.MarketInfo.sId,
      allianceId: AppContext.MarketInfo.aId,
      visitortraceId: AppContext.MarketInfo.visitortraceId,
      sourceId: Channel.sourceId || '',
      abVersion: '', // todo
      partialVersion: AppContext.CarEnv.BuildTime,
      crnVersion: Application.version || '',
      uId: AppContext.UserInfo.data ? AppContext.UserInfo.data.UserID : '',
      telephone: Channel.telephone || '',
      currentTime: moment(curDate, moment.ISO_8601).format('YYYY-MM-DD HH:mm:ss'),
      beijingTime: moment(curDate)
        .utcOffset(8)
        .format('YYYY-MM-DD HH:mm:ss'),
      awakeTime: AppContext.MarketInfo.awakeTime,
      age,
      defaultAge: age === AgeConfig.DEFAULT_AGE.val,
      ...languageInfo,
      ...locationAndDateInfo,
    };
  }

  static LogCode = async (data: LogCodeType) => {
    const logBasicInfo = await CarLog.logBasicInfo();
    const newData = data;
    if (!data.name && ClickKey[data.enName]) newData.name = ClickKey[data.enName].NAME;
    const codeData = {
      ...logBasicInfo, ...newData,
    };
    console.log('log+++codeData', codeData);
    Log.logCode(LogKey.CLICK_KEY, codeData);
  }

  static LogTrace = async (data: LogTraceType) => {
    const { key, info = {} } = data;
    if (key) {
      const logBasicInfo = await CarLog.logBasicInfo();
      const traceData = {
        ...logBasicInfo, ...info,
      };
      console.log('log+++traceData++key', key);
      console.log('log+++traceData', traceData);
      Log.logTrace(key, traceData);
    }
  }

  static LogMetric = async (data: LogMetricType) => {
    const { key, value, info = {} } = data;
    if (key) {
      const logBasicInfo = await CarLog.logBasicInfo();
      const metricData = {
        ...logBasicInfo, ...info,
      };
      console.log('log+++metricData++key', key);
      console.log('log+++metricData', metricData);
      Log.logMetric(key, value, metricData);
    }
  }
}

export default CarLog;
