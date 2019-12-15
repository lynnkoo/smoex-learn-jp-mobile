import { getSharkValue } from '@ctrip/bbk-shark';

export const listDay = getSharkValue('list_day');
export const days = value => getSharkValue('days', value);
export const Reviews = getSharkValue('Reviews');
export const listShowMore = value => getSharkValue('listShowMore', value);
export const total = getSharkValue('total');
export const listFetchResult = value => getSharkValue('list_fetchResult', value);
export const allCars = getSharkValue('list_allCars');
