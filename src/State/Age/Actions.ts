import { SET_AGE, GET_AGE } from './Types';
import { ActionType } from '../../Types/ActiontType';

export interface AgeActionType extends ActionType {
  data?: Object;
}

export const setAge = data => ({
  type: SET_AGE,
  data,
});

export const getAge = () => ({
  type: GET_AGE,
});
