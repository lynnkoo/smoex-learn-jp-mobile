import { SET_COUNTRY_INFO, GET_COUNTRY_INFO } from './Types';
import { ActionType } from '../../Types/ActiontType';

export interface LocationAndDateActionType extends ActionType {
  data?: Object;
}

export const setCountryInfo = data => ({
  type: SET_COUNTRY_INFO,
  data,
});

export const getCountryInfo = () => ({
  type: GET_COUNTRY_INFO,
});
