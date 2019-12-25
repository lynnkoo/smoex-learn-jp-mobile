import {
  INCREMENT, DECREMENT, GET_DEBUG_MODE, GET_DEBUG_MODE_SUCCESS,
} from './Types';
import { ActionType } from '../../Types/ActiontType';

export interface DebugActionType extends ActionType {
  data?: number;
  isDebugMode?: boolean,
}

export const debugIncrement = (): ActionType => ({ type: INCREMENT });

export const debugDecrement = (): ActionType => ({ type: DECREMENT });

export const getDebugMode = () => ({ type: GET_DEBUG_MODE });

export const getDebugModeSuccess = (isDebugMode: boolean) => (
  { type: GET_DEBUG_MODE_SUCCESS, isDebugMode }
);
