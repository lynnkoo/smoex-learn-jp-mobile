var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { IBUCountry } from '@ctrip/crn';
import { createLogic } from 'redux-logic';
import { GET_COUNTRY_INFO } from './Types';
import { setCountryInfo } from './Actions';
import { Utils } from '../../Util/Index';
export const setCommonCountryInfo = createLogic({
    type: GET_COUNTRY_INFO,
    /* eslint-disable no-empty-pattern */
    process({}, dispatch, done) {
        return __awaiter(this, void 0, void 0, function* () {
            const curResidency = yield Utils.promisable(IBUCountry.getCurrentCountry)('callback');
            if (curResidency) {
                // const param = {
                //   countryCode: curResidency.countryCode,
                // };
                // todo
                // const fetchAppCountryId = await CarFetch.queryAppCountryId(param);
                // const result = await fetchAppCountryId.post();
                // test
                const result = {
                    isSuccessful: true,
                    countryId: 66,
                };
                console.log('setCountryInfo+++result', result);
                const countryId = result && result.isSuccessful && result.countryId;
                let countryInfo = {
                    countryId: 66,
                    countryCode: 'US',
                    countryName: 'United States',
                };
                if (countryId) {
                    countryInfo = {
                        countryId,
                        countryCode: curResidency.countryCode,
                        countryName: curResidency.localizationName,
                    };
                }
                yield dispatch(setCountryInfo(countryInfo));
            }
            done();
        });
    },
});
export default [
    setCommonCountryInfo,
];
