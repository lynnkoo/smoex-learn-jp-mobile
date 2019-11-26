import { SET_DATE_INFO, SET_LOCATION_INFO, GET_LOCATION_DATE_INFO } from './Types';
export const setDateInfo = data => ({
    type: SET_DATE_INFO,
    data,
});
export const setLocationInfo = data => ({
    type: SET_LOCATION_INFO,
    data,
});
export const getLocationAndDateInfo = () => ({
    type: GET_LOCATION_DATE_INFO,
});
