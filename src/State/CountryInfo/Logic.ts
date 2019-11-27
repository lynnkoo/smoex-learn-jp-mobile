import { IBUCountry } from '@ctrip/crn';
import { createLogic } from 'redux-logic';
import { GET_COUNTRY_INFO } from './Types';
import { setCountryInfo } from './Actions';
import { Utils } from '../../Util/Index';
import * as InitCountryInfo from '../../__datas__/CountryInfo';

export const getCountryInfo = createLogic({
  type: GET_COUNTRY_INFO,
  /* eslint-disable no-empty-pattern */
  async process({ }, dispatch, done) {
    const curResidency = await Utils.promisable(IBUCountry.getCurrentCountry)('callback');
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

      const countryId = result && result.isSuccessful && result.countryId;
      let countryInfo = InitCountryInfo;
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
