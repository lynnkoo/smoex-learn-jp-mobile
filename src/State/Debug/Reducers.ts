import { INCREMENT, DECREMENT } from './Types';
import { DebugActionType } from './Actions';

export default (state = {}, action: DebugActionType = { type: '' }) => {
  const actionType = action.type;

  if (actionType === INCREMENT) {
    return { ...state, count: action.data };
  }
  if (actionType === DECREMENT) {
    return { ...state, count: action.data };
  }
  return state;
};
