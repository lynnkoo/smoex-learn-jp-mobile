import { SET_GROUPID } from './Types';
import { ActionType } from '../../Types/ActiontType';

export interface ListVehGroupActionType extends ActionType {
  data?: Object;
}

export const setActiveGroupId = data => ({
  type: SET_GROUPID,
  data,
});
