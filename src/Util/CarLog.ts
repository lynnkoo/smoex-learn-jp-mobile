import { Channel, Application, Log } from '@ctrip/crn';
import _ from 'lodash';
import moment from 'moment';
import Utils from './Utils';
import AppContext from './AppContext';
import { getStore } from '../State/Store';
import { AgeConfig, ClickKey, LogKey } from '../Constants/Index';

export interface LogCodeType {
  pageId?: string,
  enName: string,
  name?: string,
  [key: string]: any,
}

export interface LogTraceType {
  key: string,
  info: Object
}

export interface LogMetricType {
  key: string,
  value: number,
  info: {
    pageId: string
  }
}

const getPageId = (newData) => {
  const res = { ...newData };
  const getPageIdFn = _.get(AppContext, 'PageInstance.getPageId');
  if (!res.pageId && typeof getPageIdFn === 'function') {
    res.pageId = getPageIdFn();
  }
  return res;
};

class CarLog {
  // Get the return time and location information
  static getLocationAndDateInfo = () => {
    const state = getStore().getState();
    const { countryId, countryCode, countryName } = state.CountryInfo;
    const { rentalLocation, rentalDate } = state.LocationAndDate;
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
      isDifferentLocation: rentalLocation.pickUp.area.id !== rentalLocation.dropOff.area.id,
      isSendCar: '2',
      isPickupCar: '2',
      residency: `${countryId}` || '66',
      countryCode,
      countryName,
    };
  }

  static logBasicInfo = () => {
    const locationAndDateInfo = CarLog.getLocationAndDateInfo();
    const curDate = new Date();
    const state = getStore().getState();
    const { age } = state.DriverAgeAndNumber;
    return {
      sourceFrom: AppContext.CarEnv.appType,
      businessType: Utils.getBusinessType(),
      distibutionChannelId: Utils.isQunarApp()
        ? AppContext.MarketInfo.childChannelId : AppContext.MarketInfo.channelId,
      channelId: Utils.isQunarApp()
        ? AppContext.MarketInfo.channelId : AppContext.MarketInfo.childChannelId,
      sId: AppContext.MarketInfo.sId,
      allianceId: AppContext.MarketInfo.aId,
      visitortraceId: AppContext.MarketInfo.visitortraceId,
      sourceId: Channel.sourceId || '',
      abVersion: AppContext.ABTesting.trace,
      partialVersion: AppContext.CarEnv.buildTime,
      crnVersion: Application.version || '',
      uId: AppContext.UserInfo.UserID || '',
      telephone: Channel.telephone || '',
      currentTime: moment(curDate, moment.ISO_8601).format('YYYY-MM-DD HH:mm:ss'),
      beijingTime: moment(curDate)
        .utcOffset(8)
        .format('YYYY-MM-DD HH:mm:ss'),
      awakeTime: AppContext.MarketInfo.awakeTime,
      age,
      defaultAge: age === AgeConfig.DEFAULT_AGE.getVal(),
      ...AppContext.LanguageInfo,
      ...locationAndDateInfo,
    };
  }

  static LogCode = (data: LogCodeType) => {
    const newData = getPageId(data);
    if (!data.name && ClickKey[data.enName]) newData.name = ClickKey[data.enName].NAME;
    Log.logCode(LogKey.CLICK_KEY, { ...CarLog.logBasicInfo(), ...newData });
  }

  static LogTrace = async (data: LogTraceType) => {
    Log.logTrace(data.key, { ...CarLog.logBasicInfo(), ...data.info });
  }

  static LogMetric = (data: LogMetricType) => {
    Log.logMetric(data.key, data.value, { ...CarLog.logBasicInfo(), ...data.info });
  }
}

export default CarLog;
