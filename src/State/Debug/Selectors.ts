// cache redux query

/* eslint-disable import/prefer-default-export */
export const getCount = state => state.debug.count || 0;
export const isDebugMode = state => state.debug.isDebugMode;
