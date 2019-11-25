import { Env, Storage } from '@ctrip/crn';
import {
  ENV_TYPE,
  DOMAIN_URL,
  APP_TYPE,
  APP_ID,
  CHANNEL_TYPE,
  CHANNEL_TYPE_UNION,
  BUSINESS_TYPE,
} from '../Constants/Platform';

class Utils {
  static async getEnvType(): Promise<string> {
    return new Promise((resolve) => {
      Env.getEnvType(env => resolve(env));
    });
  }

  static getDomainURL(env: string): string {
    return DOMAIN_URL[env] || DOMAIN_URL[ENV_TYPE.PROD];
  }

  // APP Type is oneof : CTRIP_ISD & CTRIP_OSD & TRIP
  static getAppType(): string {
    /* eslint-disable dot-notation */
    if (global['__crn_appId'] === APP_ID.TRIP) {
      return APP_TYPE.TRIP;
    }
    if (global['__crn_productName'] === CHANNEL_TYPE.OSD) {
      return APP_TYPE.CTRIP_OSD;
    }
    if (global['__crn_productName'] === CHANNEL_TYPE.ISD) {
      return APP_TYPE.CTRIP_ISD;
    }

    return APP_TYPE.UNKNOW;
  }

  // distinguish Trip and Ctrip
  // used in MCD publish channel type
  static getChannelName(): string {
    return global['__crn_appId'] === APP_ID.TRIP
      ? CHANNEL_TYPE_UNION.TRIP
      : CHANNEL_TYPE_UNION.CTRIP;
  }

  static getBusinessType(): String {
    if (global['__crn_appId'] === APP_ID.TRIP) {
      return BUSINESS_TYPE.IBU;
    }

    if (global['__crn_productName'] === CHANNEL_TYPE.OSD) {
      return BUSINESS_TYPE.OSD;
    }

    if (global['__crn_productName'] === CHANNEL_TYPE.ISD) {
      return BUSINESS_TYPE.ISD;
    }

    return BUSINESS_TYPE.UNKNOW;
  }

  static isZucheApp(): boolean {
    return global['__crn_appId'] === APP_ID.ZUCHE;
  }

  static loadStoragePromise(params): any {
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
}

export default Utils;
