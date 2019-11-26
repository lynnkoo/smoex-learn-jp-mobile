var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Channel, Application } from '@ctrip/crn';
import moment from 'moment';
import Utils from './Utils';
import AppContext from './AppContext';
import CarI18n from './CarI18n';
import Locale from './Locale';
import { getStore } from '../State/Store';
class CarLog {
}
CarLog.getLocationAndDateInfo = () => {
    const state = getStore().getState();
    const { countryId, countryCode, countryName } = state.LocationAndDateReducer;
    return {
        pickupCityId: '',
        pickupCityName: '',
        pickupLocationCode: '',
        pickupLocationType: '',
        pickupLocationName: '',
        pickupDateTime: '',
        dropOffCityId: '',
        dropOffCityName: '',
        dropOffLocationCode: '',
        dropOffLocationType: '',
        dropOffLocationName: '',
        dropOffDateTime: '',
        isOneWay: '',
        isSendCar: '2',
        isPickupCar: '2',
        residency: `${countryId}` || '66',
        countryCode,
        countryName,
    };
};
// language、currency and other IBU information
CarLog.getLanguageInfo = () => __awaiter(void 0, void 0, void 0, function* () {
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
    return Object.assign(Object.assign({ sourceFrom: AppContext.CarEnv.AppType, businessType: Utils.getBusinessType(), distibutionChannelId: Utils.isQunarApp() ? AppContext.MarketInfo.childChannelId : AppContext.MarketInfo.channelId, channelId: Utils.isQunarApp() ? AppContext.MarketInfo.channelId : AppContext.MarketInfo.childChannelId, sId: AppContext.MarketInfo.sId, allianceId: AppContext.MarketInfo.aId, visitortraceId: AppContext.MarketInfo.visitortraceId, sourceId: Channel.sourceId || '', vid: '', pvid: '', abVersion: '', partialVersion: AppContext.CarEnv.BuildTime, crnVersion: Application.version || '', uId: '', telephone: Channel.telephone || '', currentTime: moment(curDate, moment.ISO_8601).format('YYYY-MM-DD HH:mm:ss'), beijingTime: moment(curDate)
            .utcOffset(8)
            .format('YYYY-MM-DD HH:mm:ss'), create: AppContext.MarketInfo.awakeTime, age: '', defaultAge: '' }, languageInfo), locationAndDateInfo);
});
CarLog.LogCode = () => {
};
CarLog.LogTrace = () => {
};
CarLog.LogMetric = () => {
};
export default CarLog;
