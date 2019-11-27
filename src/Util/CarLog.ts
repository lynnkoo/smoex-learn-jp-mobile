import { Channel, Application, Log } from '@ctrip/crn';
import moment from 'moment';
import Utils from './Utils';
import AppContext from './AppContext';
import { getStore } from '../State/Store';
import { AgeConfig, ClickKey, LogKey } from '../Constants/Index';

export interface LogCodeType {
  pageId: string,
  enName: string,
  name?: string
}

export interface LogTraceType {
  key: string,
  info: Object
}

export interface LogMetricType {
  key: string,
  value: number,
  info: Object
}

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
      isOneWay: rentalLocation.isOneWay,
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
    const { age } = state.DriverAge;
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
      uId: AppContext.UserInfo.UserID || '',
      telephone: Channel.telephone || '',
      currentTime: moment(curDate, moment.ISO_8601).format('YYYY-MM-DD HH:mm:ss'),
      beijingTime: moment(curDate)
        .utcOffset(8)
        .format('YYYY-MM-DD HH:mm:ss'),
      awakeTime: AppContext.MarketInfo.awakeTime,
      age,
      defaultAge: age === AgeConfig.DEFAULT_AGE.val,
      ...AppContext.LanguageInfo,
      ...locationAndDateInfo,
    };
  }

  static LogCode = (data: LogCodeType) => {
    const newData = data;
    if (!data.name && ClickKey[data.enName]) newData.name = ClickKey[data.enName].NAME;
    Log.logCode(LogKey.CLICK_KEY, { ...CarLog.logBasicInfo(), ...newData });
  }

  static LogTrace = async (data: LogTraceType) => { Log.logTrace(data.key, { ...CarLog.logBasicInfo(), ...data.info }); }

  static LogMetric = (data: LogMetricType) => { Log.logMetric(data.key, data.value, { ...CarLog.logBasicInfo(), ...data.info }); }
}

export default CarLog;
