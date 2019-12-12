import { SET_STATUS, GET_STATUS } from './Types';

export const setStatus = (data: any) => ({
  type: SET_STATUS,
  data,
});

export const getStatus = (data: any) => ({
  type: GET_STATUS,
  data,
});
