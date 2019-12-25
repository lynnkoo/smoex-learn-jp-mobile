import {
  SET_STATUS, GET_STATUS, INIT_SET_GROUPID, SET_GROUPID,
  FETCH_LIST_BATCH, FETCH_LIST, FETCH_LIST_CALLBACK,
  SET_ACTIVE_FILTER_BAR_CODE,
  UPDATE_SELECTED_FILTER,
  DELETE_SELECTED_FILTER,
  CLEAR_SELECTED_FILTER,
  SET_LOCATIONDATEPOP_VISIBLE,
  SET_DATEPICKER_VISIBLE,
  RESET,
} from './Types';

const getInitalState = () => ({
  isLoading: true,
  isFail: false,
  progress: 0,
  activeGroupId: '',
  activeFilterBarCode: '',
  selectedFilters: {
    sortFilter: '1',
    priceFilter: [],
    bitsFilter: [],
    filterLabels: [],
  },
  bitsFilterByBar: { // filterbar上选项所对应的选中筛选项
    filter: [],
  },
  batchesRequest: [], // 记录当前页面响应回来的请求次数, resCode: 201/200, result: 1成功，-1失败
  locationDatePopVisible: false,
  datePickerVisible: false,
  datePickerFocusOnRtime: false,
});

const initalState = getInitalState();

const initalStateClone = JSON.stringify(initalState);

const initActiveGroupId = (state, action) => ({
  ...state,
  activeGroupId: (!state.activeGroupId && action.data.activeGroupId) || state.activeGroupId,
});

export default (state = initalState, action) => {
  switch (action.type) {
    case SET_STATUS:
      return {
        ...state,
        isLoading: action.data.isLoading,
        isFail: action.data.isFail,
        progress: action.data.progress,
      };
    case INIT_SET_GROUPID:
      return initActiveGroupId(state, action);
    case SET_GROUPID:
      return { ...state, activeGroupId: action.data.activeGroupId || state.activeGroupId };
    case SET_ACTIVE_FILTER_BAR_CODE:
      return { ...state, activeFilterBarCode: action.data.activeFilterBarCode };
    case UPDATE_SELECTED_FILTER:
      return { ...state, selectedFilters: Object.assign(state.selectedFilters, action.data) };
    case SET_LOCATIONDATEPOP_VISIBLE:
      return { ...state, locationDatePopVisible: action.data.visible };
    case SET_DATEPICKER_VISIBLE:
      return {
        ...state,
        datePickerVisible: action.data.visible,
        datePickerFocusOnRtime: action.data.focurOnRTime !== undefined
          ? action.data.focurOnRTime : state.datePickerFocusOnRtime,
      };
    case DELETE_SELECTED_FILTER:
      return { ...state, selectedFilters: Object.assign(state.selectedFilters, action.data) };
    case CLEAR_SELECTED_FILTER:
      return {
        ...state,
        selectedFilters: Object.assign(
          { ...state.selectedFilters }, { priceFilter: [], bitsFilter: [], filterLabels: [] }),
      };
    case RESET:
      return { ...JSON.parse(initalStateClone) };
    case GET_STATUS:
    case FETCH_LIST_BATCH:
    case FETCH_LIST:
    case FETCH_LIST_CALLBACK:
    default:
      return state;
  }
};
