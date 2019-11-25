import { INCREMENT, DECREMENT } from './Types';
import { ActionType } from '../../Types/ActiontType';

export interface DebugActionType extends ActionType {
  data?: number;
}

export const debugIncrement = (): ActionType => ({ type: INCREMENT });

export const debugDecrement = (): ActionType => ({ type: DECREMENT });
