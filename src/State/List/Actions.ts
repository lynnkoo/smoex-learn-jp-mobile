import {
  SET_STATUS,
  GET_STATUS,
  SET_GROUPID,
  INIT_SET_GROUPID,
  FETCH_LIST,
  FETCH_LIST_BATCH,
  FETCH_LIST_CALLBACK,
  SET_BATCH_REQUEST,
  SET_ACTIVE_FILTER_BAR_CODE,
  UPDATE_SELECTED_FILTER,
  DELETE_SELECTED_FILTER,
  CLEAR_SELECTED_FILTER,
  SET_LOCATIONDATEPOP_VISIBLE,
  SET_DATEPICKER_VISIBLE,
  SET_AGEPICKER_VISIBLE,
  SET_AGETIPPOP_VISIBLE,
  SET_PROGRESS_ISFINISH,
  SET_SORTANDFILTER_VISIBLE,
  RESET,
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

export const setActiveFilterBarCode = data => ({
  type: SET_ACTIVE_FILTER_BAR_CODE,
  data,
});

export const updateSelectedFilter = data => ({
  type: UPDATE_SELECTED_FILTER,
  data,
});

export const deleteSelectedFilter = data => ({
  type: DELETE_SELECTED_FILTER,
  data,
});

export const clearSelectedFilter = () => ({
  type: CLEAR_SELECTED_FILTER,
});

export const setLocationAndDatePopIsShow = data => ({
  type: SET_LOCATIONDATEPOP_VISIBLE,
  data,
});

export const setDatePickerIsShow = data => ({
  type: SET_DATEPICKER_VISIBLE,
  data,
});

export const setAgePickerIsShow = data => ({
  type: SET_AGEPICKER_VISIBLE,
  data,
});

export const setAgeTipPopIsShow = data => ({
  type: SET_AGETIPPOP_VISIBLE,
  data,
});

export const setProgressIsFinish = data => ({
  type: SET_PROGRESS_ISFINISH,
  data,
});

export const setFilterModalIsShow = data => ({
  type: SET_SORTANDFILTER_VISIBLE,
  data,
});

export const reset = () => ({
  type: RESET,
});
