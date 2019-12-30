import { Util } from '@ctrip/crn';
import { createLogic } from 'redux-logic';
import { GET_DEBUG_MODE } from './Types';
import StorageKey from '../../Constants/StorageKey';
import CarStorage from '../../Util/CarStorage';

import { getDebugModeSuccess } from './Actions';

export const setDebugModeSuccess = createLogic({
  type: GET_DEBUG_MODE,

  /* eslint-disable no-empty-pattern */
  async process({ }, dispatch, done) {
    let result = '';
    if (Util.isInChromeDebug) {
      result = await CarStorage.loadSync(StorageKey.DEBUG);
    } else {
      result = CarStorage.loadSync(StorageKey.DEBUG);
    }
    if (result === 'true') {
      dispatch(getDebugModeSuccess(true));
    }
    done();
  },
});

export default [
  setDebugModeSuccess,
];
