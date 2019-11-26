import { SET_COUNTRY_INFO, GET_COUNTRY_INFO } from './Types';
export const setCountryInfo = data => ({
    type: SET_COUNTRY_INFO,
    data,
});
export const getCountryInfo = () => ({
    type: GET_COUNTRY_INFO,
});
