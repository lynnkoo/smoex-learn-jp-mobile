import { getSharkValue } from '@ctrip/bbk-shark';

export const listDay = getSharkValue('list_day');
export const days = value => getSharkValue('days', value);
export const review = value => getSharkValue('review', value);
export const listShowMore = value => getSharkValue('listCombine_showMore', value);
export const total = getSharkValue('total');
export const listFetchResult = value => getSharkValue('list_fetchResult', value);
export const listLoading = getSharkValue('list_loading');
