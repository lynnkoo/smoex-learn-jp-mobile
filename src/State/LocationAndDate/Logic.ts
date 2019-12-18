import { createLogic } from 'redux-logic';
import { GET_LOCATION_DATE_INFO, SET_LOCATION_INFO } from './Types';
import { setDateInfo, setLocationInfo } from './Actions';
import { getRentalLocation } from './Selectors';
import {
  getLoactionFromEvent, getInitPTime, getInitRTime, getInitLocationInfo,
} from './Mappers';

export const setCommonDateInfo = createLogic({
  type: GET_LOCATION_DATE_INFO,
  /* eslint-disable no-empty-pattern */
  async process({ }, dispatch, done) {
    const rentalLocation = getInitLocationInfo();
    if (rentalLocation) {
      dispatch(setLocationInfo(rentalLocation));
    }
    dispatch(setDateInfo({ pickup: getInitPTime(), dropoff: getInitRTime() }));
    done();
  },
});

export const setGroupIdByIndex = createLogic({
  type: SET_LOCATION_INFO,
  transform({ getState, action }: any, next) {
    const data = action.data || {};
    const { fromEvent } = data;
    if (fromEvent === 'changeRentalLocation') {
      const { isOneWay } = getRentalLocation(getState());
      // todo: isOneWay 含义统一
      const newData = getLoactionFromEvent(data, !isOneWay);
      next({
        ...action,
        data: newData,
      });
    }
    next(action);
  },
});


export default [
  setCommonDateInfo,
  setGroupIdByIndex,
];
