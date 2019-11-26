import { IBUCountry } from '@ctrip/crn';
import Utils from './Utils';
import { getStore } from '../State/Store';
import * as LocationAndDateAction from '../State/LocationAndDate/Actions';

const initializeCountryId = async () => {
  const curResidency = await Utils.promisable(IBUCountry.getCurrentCountry)('callback');
  console.log('测试+++curResidency', curResidency);
  if (curResidency) {
    // const param = {
    //   countryCode: curResidency.countryCode,
    // };

    // 待办
    // const fetchAppCountryId = await CarFetch.queryAppCountryId(param);
    // const result = await fetchAppCountryId.post();

    // 测试
    const result = {
      isSuccessful: true,
      countryId: 66,
    };

    console.log('测试+++result', result);

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

    getStore().dispatch(LocationAndDateAction.setCountryInfo(countryInfo));
  }
};

class AppInstance {
  static init = async () => {
    initializeCountryId();
  }
}

export default AppInstance;
