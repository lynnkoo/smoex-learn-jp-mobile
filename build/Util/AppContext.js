var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Channel, Business } from '@ctrip/crn';
import BuildTime from '../BuildTime';
import Utils from './Utils';
import { CHANNEL_TYPE_UNION, CHANNEL_ID } from '../Constants/Platform';
class AppContext {
}
AppContext.MarketInfo = {
    channelId: '',
    childChannelId: '',
    sId: Channel.sId || '',
    aId: Channel.alianceId || '',
    visitortraceId: '',
    awakeTime: '',
};
AppContext.QConfig = {};
AppContext.Cache = {};
AppContext.CarEnv = { BuildTime, AppType: '' };
AppContext.SharkKeys = {};
AppContext.UserInfo = { data: undefined };
AppContext.Url = '';
AppContext.init = (props) => __awaiter(void 0, void 0, void 0, function* () {
    Utils.setUserInfo();
    if (AppContext.UrlQuery) {
        const propsUrl = JSON.parse(JSON.stringify(props.urlQuery).toLowerCase());
        const ubt = yield Utils.getUBT();
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
        }
        else if (propsUrl.from === 'car') {
            AppContext.MarketInfo.channelId = CHANNEL_ID.CTRIP_MAIN_APP;
        }
        else if (propsUrl.s === 'car') {
            AppContext.MarketInfo.channelId = CHANNEL_ID.CTRIP_MAIN_H5;
        }
        else if (Utils.isZucheApp()) {
            AppContext.MarketInfo.channelId = CHANNEL_ID.ZUCHE;
        }
        else if (Utils.getChannelName() === CHANNEL_TYPE_UNION.CTRIP) {
            AppContext.MarketInfo.channelId = CHANNEL_ID.CTRIP_DEFAULT;
        }
        // init childChannelId
        if (propsUrl.childchannelid) {
            AppContext.MarketInfo.childChannelId = propsUrl.childchannelid;
        }
        // init sId
        const wakeResult = yield Business.getWakeUpDataSync();
        if (propsUrl.sid) {
            AppContext.MarketInfo.sId = propsUrl.sid;
        }
        else if (wakeResult && wakeResult.awake_sid) {
            AppContext.MarketInfo.sId = wakeResult.awake_sid;
        }
        else if (ubt.sid) {
            AppContext.MarketInfo.sId = ubt.sid;
        }
        // init aId
        if (propsUrl.allianceid || propsUrl.aid) {
            AppContext.MarketInfo.aId = propsUrl.allianceid || propsUrl.aid;
        }
        else if (wakeResult && wakeResult.awake_allianceid) {
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
});
export default AppContext;
