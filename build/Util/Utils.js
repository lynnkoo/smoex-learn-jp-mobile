var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Env } from '@ctrip/crn';
import { ENV_TYPE, DOMAIN_URL, APP_TYPE, APP_ID, } from '../Constants/Platform';
class Utils {
    static getEnvType() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                Env.getEnvType(env => resolve(env));
            });
        });
    }
    static getDomainURL(env) {
        return DOMAIN_URL[env] || DOMAIN_URL[ENV_TYPE.PROD];
    }
    /**
     * APP Type is oneof : CTRIP_ISD & CTRIP_OSD & TRIP
     * How to define App type? AppId + urlAppType is unique
     * AppId : Enum APP_ID
     * urlAppType : Enum APP_TYPE
     *  37 + TRIP
     *  999999 + CTRIP_OSD
     *  999999 + CTRIP_ISD
     * @param {string} urlAppType from url CRNModuleName=rn_car_app&CRNType=1&AppType=CTRIP_OSD
     * @return {string} return Enum APP_TYPE
     */
    static getAppType(urlAppType = '') {
        /* eslint-disable dot-notation */
        if (global['__crn_appId'] === APP_ID.TRIP)
            return APP_TYPE.TRIP;
        if (urlAppType.toUpperCase() === APP_TYPE.CTRIP_OSD)
            return APP_TYPE.CTRIP_OSD;
        if (urlAppType.toUpperCase() === APP_TYPE.CTRIP_ISD)
            return APP_TYPE.CTRIP_ISD;
        return APP_TYPE.UNKNOW;
    }
}
// distinguish Trip and Ctrip
// used in MCD publish channel type
Utils.getChannelName = () => global['__crn_productName'];
export default Utils;
