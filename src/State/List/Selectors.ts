export const getIsLoading = state => state.List.isLoading;

export const getIsFail = state => state.List.isFail;

export const getProgress = state => state.List.progress;

export const getActiveGroupId = state => state.List.activeGroupId;

export const getActiveFilterBarCode = (state: any): string => state.List.activeFilterBarCode;

export const getSelectedFilters = state => state.List.selectedFilters;
