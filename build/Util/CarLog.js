var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Channel, Application, Log } from '@ctrip/crn';
import moment from 'moment';
import Utils from './Utils';
import AppContext from './AppContext';
import CarI18n from './CarI18n';
import Locale from './Locale';
import { getStore } from '../State/Store';
import { AgeConfig, ClickKey, LogKey, Platform, } from '../Constants/Index';
class CarLog {
}
// Get the return time and location information
CarLog.getLocationAndDateInfo = () => {
    const state = getStore().getState();
    const { countryId, countryCode, countryName } = state.CountryInfoReducer;
    const { rentalLocation, rentalDate } = state.LocationAndDateReducer;
    const pickupTime = moment(rentalDate.pickUp.dateTime, moment.ISO_8601).format('YYYY-MM-DD HH:mm:ss');
    const dropOffTime = moment(rentalDate.dropOff.dateTime, moment.ISO_8601).format('YYYY-MM-DD HH:mm:ss');
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
};
// Get language and currency information
CarLog.getLanguageInfo = () => __awaiter(void 0, void 0, void 0, function* () {
    if (Utils.getChannelName() === Platform.CHANNEL_TYPE_UNION.CTRIP) {
        return {
            language: '',
            locale: '',
            site: '',
            currency: '',
        };
    }
    const { locale } = yield CarI18n.getCurrentLocale();
    const { code: currency } = yield CarI18n.getCurrentCurrency('callback');
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
});
CarLog.logBasicInfo = () => __awaiter(void 0, void 0, void 0, function* () {
    const languageInfo = yield CarLog.getLanguageInfo();
    const locationAndDateInfo = yield CarLog.getLocationAndDateInfo();
    const curDate = new Date();
    const state = getStore().getState();
    const { age } = state.AgeReducer;
    return Object.assign(Object.assign({ sourceFrom: AppContext.CarEnv.AppType, businessType: Utils.getBusinessType(), distibutionChannelId: Utils.isQunarApp() ? AppContext.MarketInfo.childChannelId : AppContext.MarketInfo.channelId, channelId: Utils.isQunarApp() ? AppContext.MarketInfo.channelId : AppContext.MarketInfo.childChannelId, sId: AppContext.MarketInfo.sId, allianceId: AppContext.MarketInfo.aId, visitortraceId: AppContext.MarketInfo.visitortraceId, sourceId: Channel.sourceId || '', abVersion: '', partialVersion: AppContext.CarEnv.BuildTime, crnVersion: Application.version || '', uId: AppContext.UserInfo.data ? AppContext.UserInfo.data.UserID : '', telephone: Channel.telephone || '', currentTime: moment(curDate, moment.ISO_8601).format('YYYY-MM-DD HH:mm:ss'), beijingTime: moment(curDate)
            .utcOffset(8)
            .format('YYYY-MM-DD HH:mm:ss'), awakeTime: AppContext.MarketInfo.awakeTime, age, defaultAge: age === AgeConfig.DEFAULT_AGE.val }, languageInfo), locationAndDateInfo);
});
CarLog.LogCode = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const logBasicInfo = yield CarLog.logBasicInfo();
    const newData = data;
    if (!data.name && ClickKey[data.enName])
        newData.name = ClickKey[data.enName].NAME;
    const codeData = Object.assign(Object.assign({}, logBasicInfo), newData);
    console.log('测试+++codeData', codeData);
    Log.logCode(LogKey.CLICK_KEY, codeData);
});
CarLog.LogTrace = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { key, info = {} } = data;
    if (key) {
        const logBasicInfo = yield CarLog.logBasicInfo();
        const traceData = Object.assign(Object.assign({}, logBasicInfo), info);
        console.log('测试+++traceData++key', key);
        console.log('测试+++traceData', traceData);
        Log.logTrace(key, traceData);
    }
});
CarLog.LogMetric = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { key, value, info = {} } = data;
    if (key) {
        const logBasicInfo = yield CarLog.logBasicInfo();
        const metricData = Object.assign(Object.assign({}, logBasicInfo), info);
        console.log('测试+++metricData++key', key);
        console.log('测试+++metricData', metricData);
        Log.logMetric(key, value, metricData);
    }
});
export default CarLog;
