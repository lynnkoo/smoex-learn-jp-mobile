import { SET_GROUPID, INIT_SET_GROUPID } from './Types';

const getInitalState = () => ({ activeGroupId: '' });

const initalState = getInitalState();

const initActiveGroupId = (state, action) => ({
  ...state,
  activeGroupId: (!state.activeGroupId && action.data.activeGroupId) || state.activeGroupId,
});

export default function DriverAge(state = initalState, action) {
  switch (action.type) {
    case INIT_SET_GROUPID:
      return initActiveGroupId(state, action);
    case SET_GROUPID:
      return { ...state, activeGroupId: action.data.activeGroupId || state.activeGroupId };
    default:
      return state;
  }
}
