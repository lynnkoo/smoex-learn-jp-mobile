import { createLogic } from 'redux-logic';
import moment from 'moment';
import { GET_LOCATION_DATE_INFO, SET_LOCATION_INFO } from './Types';
import { setDateInfo, setLocationInfo } from './Actions';
import { getRentalLocation } from './Selectors';
import { Utils } from '../../Util/Index';
import {
  initRentalLocation, initDatePickup, initDateDropoff,
} from '../../__datas__/LocationAndDate';
import { getLoactionFromEvent } from './Mappers';

export const setCommonDateInfo = createLogic({
  type: GET_LOCATION_DATE_INFO,
  /* eslint-disable no-empty-pattern */
  async process({ }, dispatch, done) {
    // todo
    // const param = { landingUrl: AppContext.url };
    // const res = await CarFetch.getRouterAdapter(param);
    // test
    const testRes = {
      rentalLocation: initRentalLocation,
      rentalDate: {
        pickUp: { dateTime: initDatePickup },
        dropOff: { dateTime: initDateDropoff },
      },
    };
    const res = {
      params: JSON.stringify(testRes),
    };
    if (res && res.params) {
      const data = JSON.parse(res.params);
      const { rentalLocation, rentalDate } = data;
      if (rentalLocation) {
        dispatch(setLocationInfo(rentalLocation));
      }
      const pTime = (rentalDate && rentalDate.pickUp && rentalDate.pickUp.dateTime) || '';
      const rTime = (rentalDate && rentalDate.dropOff && rentalDate.dropOff.dateTime) || '';
      if (pTime.length === 14) {
        let p = moment(Utils.dateTimeFormat(pTime), moment.ISO_8601);
        let r = moment(Utils.dateTimeFormat(rTime), moment.ISO_8601);
        if (!p.isValid() || p < moment()) {
          p = moment()
            .startOf('hour')
            .add(7, 'd')
            .hours(10);
        }

        if (r <= p || !r.isValid()) {
          r = moment(p, moment.ISO_8601).add(7, 'd');
        }

        dispatch(setDateInfo({ pickup: p, dropoff: r }));
      }
    }
    done();
  },
});

export const setGroupIdByIndex = createLogic({
  type: SET_LOCATION_INFO,
  transform({ getState, action }: any, next) {
    const data = action.data || {};
    const { fromEvent } = data;
    if (fromEvent === 'changeRentalLocation') {
      const { isShowDropOff } = getRentalLocation(getState());
      const newData = getLoactionFromEvent(data, isShowDropOff);
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
