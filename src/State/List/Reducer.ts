import {
  SET_STATUS, GET_STATUS, INIT_SET_GROUPID, SET_GROUPID, FETCH_LIST_BATCH, FETCH_LIST, FETCH_LIST_CALLBACK,
} from './Types';

const getInitalState = () => ({
  isLoading: true,
  isFail: false,
  progress: 0,
  activeGroupId: '',
  activeFilterBarCode: '',
  selectedFilters: {
    sortFilter: '',
    priceFilter: [],
    bitsFilter: [],
  },
  batchesRequest: [], // 记录当前页面响应回来的请求次数, resCode: 201/200, result: 1成功，-1失败
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
    case FETCH_LIST_BATCH:
    case FETCH_LIST:
    case FETCH_LIST_CALLBACK:
    default:
      return state;
  }
};
