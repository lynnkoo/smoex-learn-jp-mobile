import {
  SET_STATUS, GET_STATUS, SET_GROUPID, INIT_SET_GROUPID, FETCH_LIST, FETCH_LIST_BATCH, FETCH_LIST_CALLBACK,
  SET_BATCH_REQUEST,
} from './Types';
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

export const setActiveGroupId = (data: any) => ({
  type: SET_GROUPID,
  data,
});

export const initActiveGroupId = data => ({
  type: INIT_SET_GROUPID,
  data,
});

export const fetchListBatchQuery = () => ({
  type: FETCH_LIST_BATCH,
});

export const fetchApiList = data => ({
  type: FETCH_LIST,
  data,
});

export const fetchApiListCallback = data => ({
  type: FETCH_LIST_CALLBACK,
  data,
});

export const setBatchRequest = data => ({
  type: SET_BATCH_REQUEST,
  data,
});
