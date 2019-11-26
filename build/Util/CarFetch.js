var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { fetch, cancelFetch } from '@ctrip/crn';
import uuid from 'uuid';
import Utils from './Utils';
import { REST_SOA } from '../Constants/Platform';
class FetchBase {
    constructor() {
        this.envType = null;
        this.getDomainURL = (env) => Utils.getDomainURL(env);
        this.getRequestUrl = (url, protocol = 'https') => __awaiter(this, void 0, void 0, function* () {
            const env = yield this.getEnvType();
            const domain = this.getDomainURL(env);
            return `${protocol}://${domain}/${REST_SOA}/${url}`;
        });
        this.mixinSequenceId = (params) => (params.sequenceId
            ? params : Object.assign(Object.assign({}, params), { sequenceId: uuid() }));
        this.getFetchObject = (url, params, cancelable) => __awaiter(this, void 0, void 0, function* () {
            const tmpParams = this.mixinSequenceId(params);
            const requestUrl = yield this.getRequestUrl(url);
            console.log('vv', tmpParams);
            if (!cancelable) {
                return fetch(requestUrl, tmpParams);
            }
            return {
                post: () => fetch(requestUrl, tmpParams),
                cancel: () => cancelFetch(requestUrl, { sequenceId: tmpParams.sequenceId }),
            };
        });
        this.envType = null;
    }
    getEnvType() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.envType)
                this.envType = yield Utils.getEnvType();
            return this.envType;
        });
    }
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
    constructor() {
        super(...arguments);
        this.getCityList = (params, cancelable = false) => this.getFetchObject('13589/getCategoryCity.json', params, cancelable);
        this.queryAppCountryId = (params) => this.getFetchObject('14804/queryCountryId', params, false);
    }
}
export default new CarFetch();
