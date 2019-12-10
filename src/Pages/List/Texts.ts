import { getSharkValue } from '@ctrip/bbk-shark';

export const listDay = getSharkValue('list_day');
export const days = value => getSharkValue('days', value);
export const Reviews = getSharkValue('Reviews');
export const listShowMore = value => getSharkValue('listShowMore', value);
export const total = getSharkValue('total');
