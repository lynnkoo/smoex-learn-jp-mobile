import moment from 'moment';
import { SET_DATE_INFO, SET_LOCATION_INFO, GET_LOCATION_DATE_INFO } from './Types';
import { LocationAndDateActionType } from './Actions';

const datePickup = moment()
  .startOf('hour')
  .add(7, 'd')
  .hours(10);
const dateDropoff = moment()
  .startOf('hour')
  .add(14, 'd')
  .hours(10);


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
      isOneWay: false,
    },
    rentalDate: {
      pickUp: { dateTime: datePickup },
      dropOff: { dateTime: dateDropoff },
    },
  }
);

const initalState = getInitalState();
// const initalStateClone = JSON.stringify(initalState);

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
  if (action.data.isOneWay !== undefined) {
    rentalInfo = Object.assign({}, rentalInfo, {
      isOneWay: action.data.isOneWay,
    });
  }

  return {
    ...state,
    rentalLocation: rentalInfo,
  };
};

export default function LocationAndDateReducer(state = initalState, action: LocationAndDateActionType = { type: '' }) {
  switch (action.type) {
    case SET_DATE_INFO:
      return setDateInfo(state, action);
    case SET_LOCATION_INFO:
      return setLocationInfo(state, action);
    case GET_LOCATION_DATE_INFO:
      return state;
    default:
      return state;
  }
}
