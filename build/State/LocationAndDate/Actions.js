import { SET_DATE_INFO, SET_LOCATION_INFO } from './Types';
export const setDateInfo = data => ({
    type: SET_DATE_INFO,
    data,
});
export const setLocationInfo = data => ({
    type: SET_LOCATION_INFO,
    data,
});
