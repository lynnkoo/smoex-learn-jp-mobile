import { INCREMENT, DECREMENT, GET_DEBUG_MODE_SUCCESS } from './Types';
import { DebugActionType } from './Actions';

export interface debugStateType {
  count?: number,
  isDebugMode: boolean,
}

const initalState: debugStateType = {
  isDebugMode: false,
};

export default (state: debugStateType = initalState, action: DebugActionType = { type: '' }) => {
  const actionType = action.type;
  if (actionType === INCREMENT) {
    return { ...state, count: state.count + 1 };
  }
  if (actionType === DECREMENT) {
    return { ...state, count: state.count - 1 };
  }

  if (actionType === GET_DEBUG_MODE_SUCCESS) {
    return { ...state, isDebugMode: action.isDebugMode };
  }
  return state;
};
