import { SET_STATUS, GET_STATUS, SET_GROUPID, INIT_SET_GROUPID } from './Types';
import { ActionType } from '../../Types/ActiontType';

export interface ListActionType extends ActionType {
  data?: Object;
}

export const setStatus = (data: any) => ({
  type: SET_STATUS,
  data,
});

export const getStatus = (data: any) => ({
  type: GET_STATUS,
  data,
});

export const setActiveGroupId = data => ({
  type: SET_GROUPID,
  data,
});

export const initActiveGroupId = data => ({
  type: INIT_SET_GROUPID,
  data,
});

