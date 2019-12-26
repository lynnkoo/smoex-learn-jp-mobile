import { IBUCountry } from '@ctrip/crn';
import { createLogic } from 'redux-logic';
import { GET_COUNTRY_INFO } from './Types';
import { setCountryInfo } from './Actions';
import { Utils, CarFetch } from '../../Util/Index';
import { FrontEndConfig } from '../../Constants/Index';

export const getCountryInfo = createLogic({
  type: GET_COUNTRY_INFO,
  /* eslint-disable no-empty-pattern */
  async process({ }, dispatch, done) {
    const curResidency = await Utils.promisable(IBUCountry.getCurrentCountry)('callback');
    if (curResidency) {
      let countryInfo = FrontEndConfig.CountryDefaultConfig;
      const param = {
        countryCode: curResidency.countryCode,
      };

      const res = await CarFetch.queryAppCountryId(param).catch(() => {
        dispatch(setCountryInfo(countryInfo));
        done();
      });
      const countryId = res && res.isSuccessful && res.countryId;

      if (countryId) {
        countryInfo = {
          countryId,
          countryCode: curResidency.countryCode,
          countryName: curResidency.localizationName,
        };
      }
      dispatch(setCountryInfo(countryInfo));
    }
    done();
  },
});

export default [
  getCountryInfo,
];
