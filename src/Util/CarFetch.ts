import { fetch, cancelFetch } from '@ctrip/crn';
import uuid from 'uuid';
import Utils from './Utils';
import { REST_SOA } from '../Constants/Platform';
import AppContext from './AppContext';

export interface RequestType {
  sequenceId?: string;
}

export interface FetchBaseType {
}

class FetchBase implements FetchBaseType {
  envType = null;

  constructor() {
    this.envType = null;
  }

  async getEnvType() {
    if (!this.envType) this.envType = await Utils.getEnvType();
    return this.envType;
  }

  getDomainURL = (env: string) => Utils.getDomainURL(env);

  getRequestUrl = async (url: string, protocol: string = 'https') => {
    const env = await this.getEnvType();
    const domain = this.getDomainURL(env);
    return `${protocol}://${domain}/${REST_SOA}/${url}`;
  };

  mixinSequenceId = (params: RequestType): RequestType => (params.sequenceId
    ? params : { ...params, sequenceId: uuid() });

  getBaseRequest = (params) => {
    const curParam = Object.assign({}, params);
    const requestId = curParam.requestId || uuid();
    const parentRequestId = curParam.parentRequestId || '';
    return {
      sourceFrom: AppContext.CarEnv.apptype,
      requestId,
      parentRequestId,
    };
  }

  getFetchObject = async (url: string, params, cancelable: boolean) => {
    const requestUrl = await this.getRequestUrl(url);
    const tmpParams = { ...params, baseRequest: this.getBaseRequest(params) };
    if (!cancelable) {
      return fetch(requestUrl, tmpParams);
    }

    return {
      post: () => fetch(requestUrl, tmpParams),
      cancel: () => cancelFetch(requestUrl, { sequenceId: tmpParams.baseRequest.requestId }),
    };
  };
}

// example:
// getData = async () => {
//   // cancelable = false
//   let data1 = await CarFetch.getCityList({});
//   console.log('done', data1)

//   //cancelable =true
//   let fetchInstance = await CarFetch.getCityList({}, true);
//   let data2 = await fetchInstance.post().catch(err => console.log('err', err));
//   fetchInstance.cancel();
//   console.log('done2', data2, fetchInstance)
// }
class CarFetch extends FetchBase {
  getCityList = (params: RequestType, cancelable: boolean = false) => (
    this.getFetchObject('13589/getCategoryCity.json', params, cancelable)
  );

  queryAppCountryId = params => this.getFetchObject('14804/queryCountryId', params, false);

  getRouterAdapter = params => this.getFetchObject('/13589/getRoute.json', params, false);
}

export default new CarFetch();
