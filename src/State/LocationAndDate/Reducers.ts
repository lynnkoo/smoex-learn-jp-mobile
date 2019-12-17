import moment from 'moment';
import { SET_DATE_INFO, SET_LOCATION_INFO, GET_LOCATION_DATE_INFO } from './Types';
import { LocationAndDateActionType } from './Actions';
import { initDatePickup, initDateDropoff } from '../../__datas__/LocationAndDate';

const getInitalState = () => (
  {
    rentalLocation: {
      pickUp: {
        cid: 0,
        cname: '',
        country: '',
        realcountry: '',
        area: {
          id: '',
          name: '',
          lat: 0,
          lng: 0,
          type: '',
        },
      },
      dropOff: {
        cid: 0,
        cname: '',
        country: '',
        realcountry: '',
        area: {
          id: '',
          name: '',
          lat: 0,
          lng: 0,
          type: '',
        },
      },
      isShowDropOff: false,
    },
    rentalDate: {
      pickUp: { dateTime: initDatePickup },
      dropOff: { dateTime: initDateDropoff },
    },
  }
);

const initalState = getInitalState();

const setDateInfo = (state, action) => {
  const { rentalDate } = state;
  const pTime = moment(action.data.pickup, moment.ISO_8601);
  const rTime = moment(action.data.dropoff, moment.ISO_8601);
  if (!pTime.isValid() || !rTime.isValid()) {
    return { ...state };
  }
  const pickDateTime = { dateTime: pTime };
  const dropDateTime = { dateTime: rTime };
  const tempRentalDate = Object.assign({}, rentalDate, {
    pickUp: pickDateTime,
    dropOff: dropDateTime,
  });
  return { ...state, rentalDate: tempRentalDate };
};

const setLocationInfo = (state, action) => {
  let rentalInfo = state.rentalLocation;
  if (action.data.pickUp) {
    rentalInfo = Object.assign({}, rentalInfo, {
      pickUp: action.data.pickUp,
    });
  }
  if (action.data.dropOff) {
    rentalInfo = Object.assign({}, rentalInfo, {
      dropOff: action.data.dropOff,
    });
  }
  if (action.data.isShowDropOff !== undefined) {
    rentalInfo = Object.assign({}, rentalInfo, {
      isShowDropOff: action.data.isShowDropOff,
    });
  }

  return {
    ...state,
    rentalLocation: rentalInfo,
  };
};

export default (state = initalState, action: LocationAndDateActionType = { type: '' }) => {
  switch (action.type) {
    case SET_DATE_INFO:
      return setDateInfo(state, action);
    case SET_LOCATION_INFO:
      return setLocationInfo(state, action);
    case GET_LOCATION_DATE_INFO:
    default:
      return state;
  }
};
