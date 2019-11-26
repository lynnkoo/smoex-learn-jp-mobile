import { Env, Storage } from '@ctrip/crn';
import {
  ENV_TYPE,
  DOMAIN_URL,
  APP_TYPE,
  APP_ID,
  BUSINESS_TYPE,
} from '../Constants/Platform';
import AppContext from './AppContext';

export interface storageLoadParamType {
  key: string,
  domain?: string,
  isSecret?: boolean
}

class Utils {
  static async getEnvType(): Promise<string> {
    return new Promise((resolve) => {
      Env.getEnvType(env => resolve(env));
    });
  }

  static getDomainURL(env: string): string {
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
  * @param {string} urlAppType from url CRNModuleName=rn_car_app&CRNType=1&AppType=CTRIP_OSD
  * @return {string} return Enum APP_TYPE
  */
  static getAppType(urlAppType: string = ''): string {
    /* eslint-disable dot-notation */
    if (global['__crn_appId'] === APP_ID.TRIP) return APP_TYPE.OSD_T_APP;
    if (urlAppType.toUpperCase() === APP_TYPE.OSD_C_APP) return APP_TYPE.OSD_C_APP;
    if (urlAppType.toUpperCase() === APP_TYPE.ISD_C_APP) return APP_TYPE.ISD_C_APP;
    return APP_TYPE.UNKNOW;
  }

  // distinguish Trip and Ctrip
  // used in MCD publish channel type
  static getChannelName(): string {
    return global['__crn_productName'];
  }

  static getBusinessType(): String {
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

  static isZucheApp(): boolean {
    return global['__crn_appId'] === APP_ID.ZUCHE;
  }

  static isQunarApp(): boolean {
    return AppContext.CarEnv.AppType === APP_TYPE.OSD_Q_APP;
  }

  static loadStoragePromise(params: storageLoadParamType): any {
    return new Promise((resolve) => {
      Storage.load(params, (result) => {
        resolve(result);
      });
    });
  }

  // get ubt info
  static async getUBT(): Promise<any> {
    const ubt = await Utils.loadStoragePromise({
      key: 'CTRIP_UBT_M',
      domain: 'fx.ubt',
    });

    return ubt ? JSON.parse(ubt) : {};
  }

  /**
   * 将一个回调函数 Promise 化, 由于 callback 回调在参数中的位置并不固定，所以在传入回调函数的地方需要传入字符串 'callback' 标识， 如果回调函数有多个值返回，则会包装为一个数组返回
   * @param { Function } asyncFunc 异步方法
   * @return { any } 任何值
   */
  static promisable(asyncFunc: Function): any {
    return (...args: any[]) => new Promise((resolve) => {
      const callback = (...cargs: any[]) => {
        let data;
        if (cargs && cargs.length === 1) {
          const [first] = cargs;
          data = first;
        } else {
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
      } else {
        newArgs[0] = callback;
      }
      asyncFunc(...newArgs);
    });
  }
}

export default Utils;
