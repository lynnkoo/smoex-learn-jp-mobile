import { Env, Storage } from '@ctrip/crn';
import _ from 'lodash';
import {
  ENV_TYPE,
  DOMAIN_URL,
  APP_TYPE,
  APP_ID,
  BUSINESS_TYPE,
  RENTAL_GAP,
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
  * @param {string} urlAppType from url CRNModuleName=rn_car_app&CRNType=1&apptype=OSD_C_APP
  * @return {string} return Enum APP_TYPE
  */
  static getAppType(urlAppType: string): string {
    /* eslint-disable dot-notation */
    if (global['__crn_appId'] === APP_ID.TRIP) return APP_TYPE.OSD_T_APP;
    if (urlAppType.toUpperCase() === APP_TYPE.OSD_C_APP) return APP_TYPE.OSD_C_APP;
    if (urlAppType.toUpperCase() === APP_TYPE.ISD_C_APP) return APP_TYPE.ISD_C_APP;
    return APP_TYPE.UNKNOW;
  }

  // value oneof rn_car_app | rn_ibu_car_app
  static getChannelName(): string {
    return global['__crn_productName'];
  }

  static getBusinessType(): String {
    if (Utils.isTrip()) {
      return BUSINESS_TYPE.IBU;
    } if (Utils.isCtripOsd()) {
      return BUSINESS_TYPE.OSD;
    } if (Utils.isCtripIsd()) {
      return BUSINESS_TYPE.ISD;
    }

    return BUSINESS_TYPE.UNKNOW;
  }

  static isTrip(): boolean {
    return global['__crn_appId'] === APP_ID.TRIP;
  }

  static isCtripOsd(): boolean {
    switch (AppContext.CarEnv.apptype) {
      case APP_TYPE.OSD_C_APP:
      case APP_TYPE.OSD_C_H5:
      case APP_TYPE.OSD_Q_APP:
      case APP_TYPE.OSD_ZUCHE_APP:
        return true;
      default:
        return false;
    }
  }

  static isCtripIsd(): boolean {
    switch (AppContext.CarEnv.apptype) {
      case APP_TYPE.ISD_C_APP:
      case APP_TYPE.ISD_C_H5:
      case APP_TYPE.ISD_Q_APP:
      case APP_TYPE.ISD_ZUCHE_APP:
        return true;
      default:
        return false;
    }
  }

  static isZucheApp(): boolean {
    return global['__crn_appId'] === APP_ID.ZUCHE;
  }

  static isQunarApp(): boolean {
    return AppContext.CarEnv.apptype === APP_TYPE.OSD_Q_APP;
  }

  // get ubt info
  static async getUBT(): Promise<{ sid?: string }> {
    const ubt = await Storage.loadSync({
      key: 'CTRIP_UBT_M',
      domain: 'fx.ubt',
    });

    return ubt ? JSON.parse(ubt) : {};
  }

  static promisable(asyncFunc: Function): any {
    return (...args: any[]) => new Promise((resolve) => {
      const callback = (...cargs: any[]) => {
        let data;
        if (cargs && cargs.length === 1) {
          data = cargs[0];
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

  static dateTimeFormat = (str: string): string => {
    let result = '';
    if (str !== null && str !== undefined && str.length === 14) {
      result = `${str.substr(0, 4)}-${str.substr(4, 2)}-${str.substr(6, 2)} ${str.substr(
        8,
        2,
      )}:${str.substr(10, 2)}:${str.substr(12, 2)}`;
    }
    return result;
  }

  static convertKeysToLowerCase = (param) => {
    try {
      return JSON.parse(JSON.stringify(param).toLowerCase());
    } catch (ex) {
      return {};
    }
  }

  static fullImgProtocal = (imgUrl) => {
    if (_.startsWith(imgUrl, '//')) {
      return `https:${imgUrl}`;
    }

    return imgUrl;
  }

  static getRentalGap = () => {
    if (Utils.isTrip()) {
      return RENTAL_GAP.IBU;
    } if (Utils.isCtripOsd()) {
      return RENTAL_GAP.OSD;
    } if (Utils.isCtripIsd()) {
      return RENTAL_GAP.ISD;
    }
    return RENTAL_GAP.UNKNOW;
  }
}

export default Utils;
