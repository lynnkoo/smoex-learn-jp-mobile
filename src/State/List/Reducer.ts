import {
  SET_STATUS, GET_STATUS, INIT_SET_GROUPID, SET_GROUPID,
  FETCH_LIST_BATCH, FETCH_LIST, FETCH_LIST_CALLBACK,
  SET_ACTIVE_FILTER_BAR_CODE,
  UPDATE_SELECTED_FILTER,
  DELETE_SELECTED_FILTER,
  CLEAR_SELECTED_FILTER,
  SET_LOCATIONDATEPOP_VISIBLE,
  SET_DATEPICKER_VISIBLE,
  SET_AGEPICKER_VISIBLE,
  SET_AGETIPPOP_VISIBLE,
  SET_PROGRESS_ISFINISH,
  SET_SORTANDFILTER_VISIBLE,
  SET_FILTERBAR_ISSHOW,
  RESET,
  SET_SCROLL_VIEW_HEIGHT,
} from './Types';
import { Utils } from '../../Util/Index';

const getInitalState = () => ({
  isLoading: true,
  isFail: false,
  progress: 0,
  progressIsFinish: false,
  activeGroupId: '',
  activeFilterBarCode: '',
  selectedFilters: {
    sortFilter: '1',
    priceFilter: [],
    bitsFilter: [],
    filterLabels: [],
  },
  deleteCode: '',
  bitsFilterByBar: { // filterbar上选项所对应的选中筛选项
    filter: [],
  },
  batchesRequest: [], // 记录当前页面响应回来的请求次数, resCode: 201/200, result: 1成功，-1失败
  locationDatePopVisible: false,
  datePickerVisible: false,
  datePickerFocusOnRtime: false,
  agePickerVisible: false,
  ageTipPopVisible: false,
  sortAndFilterVisible: false,
  filterBarIsShow: false,
  scrollViewHeight: Utils.heightWithStatusBar,
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
      return {
        ...state,
        selectedFilters: Object.assign(state.selectedFilters, action.data),
      };
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
      return {
        ...state,
        deleteCode: Object.assign(state.deleteCode, action.data),
      };
    case CLEAR_SELECTED_FILTER:
      return {
        ...state,
        selectedFilters: Object.assign(
          { ...state.selectedFilters }, { priceFilter: [], bitsFilter: [], filterLabels: [] }),
      };
    case SET_AGEPICKER_VISIBLE:
      return {
        ...state,
        agePickerVisible: action.data.visible,
      };
    case SET_AGETIPPOP_VISIBLE:
      return {
        ...state,
        ageTipPopVisible: action.data.visible,
      };
    case SET_PROGRESS_ISFINISH:
      return {
        ...state,
        progressIsFinish: action.data,
      };
    case SET_SORTANDFILTER_VISIBLE:
      return {
        ...state,
        sortAndFilterVisible: action.data.visible,
      };
    case SET_FILTERBAR_ISSHOW:
      return {
        ...state,
        filterBarIsShow: action.data,
      };
    case RESET:
      return { ...JSON.parse(initalStateClone) };
    case SET_SCROLL_VIEW_HEIGHT:
      return {
        ...state,
        scrollViewHeight: action.data,
      };
    case GET_STATUS:
    case FETCH_LIST_BATCH:
    case FETCH_LIST:
    case FETCH_LIST_CALLBACK:
    default:
      return state;
  }
};
