import _ from 'lodash';
import { getVehGroupList } from '../../Global/Cache/ListResSelectors';

export const getIsLoading = state => state.List.isLoading;

export const getIsFail = state => state.List.isFail;

export const getProgress = state => state.List.progress;

export const getProgressIsFinish = state => state.List.progressIsFinish;

export const getActiveGroupId = state => state.List.activeGroupId;

export const getActiveFilterBarCode = (state: any): string => state.List.activeFilterBarCode;

export const getSelectedFilters = state => state.List.selectedFilters;

export const getActiveGroupIndex = (state) => {
  const vehGroupList = getVehGroupList();
  const activeGroupId = getActiveGroupId(state);
  return Math.max(_.findIndex(vehGroupList, { gId: activeGroupId }), 0);
};

export const getDatePickerVisible = state => state.List.datePickerVisible;

export const getLocationDatePopVisible = state => state.List.locationDatePopVisible;

export const getAgePickerVisible = state => state.List.agePickerVisible;

export const getAgeTipPopVisible = state => state.List.ageTipPopVisible;

export const getSortAndFilterVisible = state => state.List.sortAndFilterVisible;

export const getFilterBarIsShow = state => state.List.filterBarIsShow;
