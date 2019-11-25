import { INCREMENT, DECREMENT } from './Types';
import { DebugActionType } from './Actions';

export interface debugStateType {
  count: number,
}

export default (state: debugStateType = { count: 0 }, action: DebugActionType = { type: '' }) => {
  const actionType = action.type;
  if (actionType === INCREMENT) {
    return { ...state, count: state.count + 1 };
  }
  if (actionType === DECREMENT) {
    return { ...state, count: state.count - 1 };
  }
  return state;
};
