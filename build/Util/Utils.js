var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Env, Storage, User } from '@ctrip/crn';
import { ENV_TYPE, DOMAIN_URL, APP_TYPE, APP_ID, BUSINESS_TYPE, } from '../Constants/Platform';
import AppContext from './AppContext';
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
    * APP Type is oneof : ISD_C_APP & OSD_C_APP & OSD_T_APP
    * How to define App type? AppId + urlAppType is unique
    * AppId : Enum APP_ID
    * urlAppType : Enum APP_TYPE
    * 37 + OSD_T_APP
    * 999999 + OSD_C_APP
    * 999999 + ISD_C_APP
    * @param {string} urlAppType from url CRNModuleName=rn_car_app&CRNType=1&AppType=OSD_C_APP
    * @return {string} return Enum APP_TYPE
    */
    static getAppType(urlAppType) {
        /* eslint-disable dot-notation */
        if (global['__crn_appId'] === APP_ID.TRIP)
            return APP_TYPE.OSD_T_APP;
        if (urlAppType.toUpperCase() === APP_TYPE.OSD_C_APP)
            return APP_TYPE.OSD_C_APP;
        if (urlAppType.toUpperCase() === APP_TYPE.ISD_C_APP)
            return APP_TYPE.ISD_C_APP;
        return APP_TYPE.UNKNOW;
    }
    // distinguish Trip and Ctrip
    // used in MCD publish channel type
    static getChannelName() {
        return global['__crn_productName'];
    }
    static getBusinessType() {
        switch (AppContext.CarEnv.AppType) {
            case APP_TYPE.OSD_C_APP:
                return BUSINESS_TYPE.OSD;
            case APP_TYPE.ISD_C_APP:
                return BUSINESS_TYPE.ISD;
            case APP_TYPE.OSD_T_APP:
                return BUSINESS_TYPE.IBU;
            default:
                return BUSINESS_TYPE.UNKNOW;
        }
    }
    static isZucheApp() {
        return global['__crn_appId'] === APP_ID.ZUCHE;
    }
    static isQunarApp() {
        return AppContext.CarEnv.AppType === APP_TYPE.OSD_Q_APP;
    }
    static loadStoragePromise(params) {
        return new Promise((resolve) => {
            Storage.load(params, (result) => {
                resolve(result);
            });
        });
    }
    // get ubt info
    static getUBT() {
        return __awaiter(this, void 0, void 0, function* () {
            const ubt = yield Utils.loadStoragePromise({
                key: 'CTRIP_UBT_M',
                domain: 'fx.ubt',
            });
            return ubt ? JSON.parse(ubt) : {};
        });
    }
    static promisable(asyncFunc) {
        return (...args) => new Promise((resolve) => {
            const callback = (...cargs) => {
                let data;
                if (cargs && cargs.length === 1) {
                    const [first] = cargs;
                    data = first;
                }
                else {
                    data = cargs;
                }
                resolve(data);
            };
            const newArgs = args;
            if (args.length) {
                const index = args.findIndex(p => p === 'callback');
                if (index > -1) {
                    newArgs[index] = callback;
                }
            }
            else {
                newArgs[0] = callback;
            }
            asyncFunc(...newArgs);
        });
    }
}
Utils.dateTimeFormat = (str) => {
    let result = '';
    if (str !== null && str !== undefined && str.length === 14) {
        result = `${str.substr(0, 4)}-${str.substr(4, 2)}-${str.substr(6, 2)} ${str.substr(8, 2)}:${str.substr(10, 2)}:${str.substr(12, 2)}`;
    }
    return result;
};
Utils.setUserInfo = () => {
    User.getUserInfo((result, info) => {
        if (info && info.data) {
            AppContext.UserInfo.data = info.data;
        }
    });
};
export default Utils;
