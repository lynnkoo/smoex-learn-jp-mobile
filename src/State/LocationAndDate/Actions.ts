import { SET_DATE_INFO, SET_LOCATION_INFO } from './Types';
import { ActionType } from '../../Types/ActiontType';

export interface LocationAndDateActionType extends ActionType {
  data?: Object
}

export const setDateInfo = data => ({
  type: SET_DATE_INFO,
  data,
});

export const setLocationInfo = data => ({
  type: SET_LOCATION_INFO,
  data,
});
