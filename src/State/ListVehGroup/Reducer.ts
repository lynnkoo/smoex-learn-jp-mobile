import { SET_GROUPID } from './Types';

const getInitalState = () => ({ activeGroupId: '' });

const initalState = getInitalState();

export default function DriverAge(state = initalState, action) {
  switch (action.type) {
    case SET_GROUPID:
      return { ...state, activeGroupId: action.data.activeGroupId || state.activeGroupId };
    default:
      return state;
  }
}
