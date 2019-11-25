import { fetch, cancelFetch } from '@ctrip/crn';
import Utils from './Utils';
import { REST_SOA } from '../Constants/Platform';

export interface RequestType {
  sequenceId: string;
}

export interface FetchBaseType {
}

class FetchBase implements FetchBaseType {
  envType = null;

  constructor() {
    this.envType = null;
  }

  async getEnvType() {
    if (this.envType) this.envType = await Utils.getEnvType();
    return this.envType;
  }

  getDomainURL = (env: string) => Utils.getDomainURL(env);

  getRequestUrl = async (url: string, protocol: string = 'https') => {
    const env = await this.getEnvType();
    const domain = this.getDomainURL(env);
    return `${protocol}://${domain}/${REST_SOA}/${url}`;
  };

  mixinSequenceId = (params: RequestType): RequestType => (params.sequenceId
    ? params : { ...params, sequenceId: 'xxx' });

  getFetchObject = async (url: string, params) => {
    const tmpParams = this.mixinSequenceId(params);
    const requestUrl = await this.getRequestUrl(url);
    return {
      post: this.post(requestUrl, tmpParams),
      cancel: this.cancel(requestUrl, tmpParams.sequenceId),
    };
  };

  post = async (url: string, params: RequestType) => fetch(url, params);

  cancel = (url: string, sequenceId: string) => cancelFetch(url, { sequenceId });
}

class CarFetch extends FetchBase {
  // example:
  //  async componentDidMount(){
  //    this.fetchCityList = await getCityList(params);
  //    this.fetchCityList.post();
  //  }
  //
  //  componentWillUnMount(){
  //    this.fetchCityList.cancel();
  //  }
  getCityList = (params: RequestType) => this.getFetchObject('1301/getCityList.json', params);
}

export default new CarFetch();
