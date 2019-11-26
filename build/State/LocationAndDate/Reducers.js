import moment from 'moment';
import { SET_COUNTRY_INFO, GET_COUNTRY_INFO } from './Types';
const datePickup = moment()
    .startOf('hour')
    .add(7, 'd')
    .hours(10);
const dateDropoff = moment()
    .startOf('hour')
    .add(14, 'd')
    .hours(10);
const getInitalState = () => ({
    rentalLocation: {
        pickUp: null,
        dropOff: null,
        isOneWay: false,
    },
    rentalDate: {
        pickUp: { dateTime: datePickup },
        dropOff: { dateTime: dateDropoff },
    },
    countryId: '',
    countryCode: '',
    countryName: '',
});
const initalState = getInitalState();
// const initalStateClone = JSON.stringify(initalState);
const setCountryInfo = (state, action) => {
    let curState = Object.assign({}, state);
    if (action.data.countryId) {
        curState = Object.assign({}, curState, { countryId: action.data.countryId });
    }
    if (action.data.countryCode) {
        curState = Object.assign({}, curState, { countryCode: action.data.countryCode });
    }
    if (action.data.countryName) {
        curState = Object.assign({}, curState, { countryName: action.data.countryName });
    }
    return Object.assign({}, curState);
};
export default function LocationAndDateReducer(state = initalState, action = { type: '' }) {
    switch (action.type) {
        case SET_COUNTRY_INFO:
            return setCountryInfo(state, action);
        case GET_COUNTRY_INFO:
            return state;
        default:
            return state;
    }
}
