import { Env } from '@ctrip/crn';
import {
  ENV_TYPE, DOMAIN_URL, APP_TYPE, APP_ID, CHANNEL_TYPE,
} from '../Constants/Platform';

class Utils {
  static async getEnvType() {
    return new Promise((resolve) => {
      Env.getEnvType(env => resolve(env));
    });
  }

  static getDomainURL(env: string) {
    return DOMAIN_URL[env] || DOMAIN_URL[ENV_TYPE.PROD];
  }

  // APP Type is oneof : CTRIP_ISD & CTRIP_OSD & TRIP
  static getAppType(): string {
    /* eslint-disable dot-notation */
    if (global['__crn_appId'] === APP_ID.TRIP) return APP_TYPE.TRIP;
    if (global['__crn_productName'] === CHANNEL_TYPE.OSD) return APP_TYPE.CTRIP_OSD;
    if (global['__crn_productName'] === CHANNEL_TYPE.ISD) return APP_TYPE.CTRIP_ISD;
    return APP_TYPE.UNKNOW;
  }
}

export default Utils;
