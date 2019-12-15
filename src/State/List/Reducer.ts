import {
  SET_STATUS, GET_STATUS, INIT_SET_GROUPID, SET_GROUPID,
} from './Types';

const getInitalState = () => ({
  isLoading: true,
  isFail: false,
  progress: 0,
  activeGroupId: '',
  activeFilterBarCode: '',
  selectedFilters: {
    sort: [],
    filters: [],
  },
});

const initalState = getInitalState();

const initActiveGroupId = (state, action) => ({
  ...state,
  activeGroupId: (!state.activeGroupId && action.data.activeGroupId) || state.activeGroupId,
});


export default (state = initalState, action) => {
  switch (action.type) {
    case SET_STATUS:
      return {
        ...state, isLoading: action.data.isLoading, isFail: action.data.isFail, progress: action.data.progress,
      };
    case INIT_SET_GROUPID:
      return initActiveGroupId(state, action);
    case SET_GROUPID:
      return { ...state, activeGroupId: action.data.activeGroupId || state.activeGroupId };
    case GET_STATUS:
    default:
      return state;
  }
};
