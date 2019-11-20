import { Env } from '@ctrip/crn';
import { ENV_TYPE, DOMAIN_URL } from '../Constants/Platform';

class Utils {
  static async getEnvType() {
    return new Promise((resolve) => {
      Env.getEnvType(env => resolve(env));
    });
  }

  static getDomainURL(env: string) {
    return DOMAIN_URL[env] || DOMAIN_URL[ENV_TYPE.PROD];
  }
}

export default Utils;
