import moment from 'moment';
import { getAdultNumbers, getChildNumbers, getAge } from '../DriverAgeAndNumber/Selectors';
import {
  getPickUpTime,
  getDropOffTime,
  getPickUpCityId,
  getPickUpLocationCode,
  getPickUpLocationName,
  getPickUpLocationType,
  getPickUpLocationLat,
  getPickUpLocationLng,
  getDropOffCityId,
  getDropOffLocationCode,
  getDropOffLocationName,
  getDropOffLocationType,
  getDropOffLocationLat,
  getDropOffLocationLng,
} from '../LocationAndDate/Selectors';

import { AgeConfig } from '../../Constants/Index';
import { getPromotionFilterItems } from '../../Global/Cache/ListResSelectors';
import { getSelectedFilters } from './Selectors';

/* eslint-disable import/prefer-default-export */
export const packageListReqParam = (state, data: { vendorGroup: number, requestId: string }) => {
  const curAge = getAge(state);
  return {
    requestId: data.requestId,
    vendorGroup: data.vendorGroup,
    age: curAge === AgeConfig.DEFAULT_AGE.val ? AgeConfig.DEFAULT_AGE.min : Number(curAge),
    adultNumbers: getAdultNumbers(state),
    childrenNumbers: getChildNumbers(state),
    pickupPointInfo: {
      cityId: getPickUpCityId(state),
      date: moment(getPickUpTime(state)).format('YYYY-MM-DD HH:mm:ss'),
      locationCode: getPickUpLocationCode(state),
      locationName: getPickUpLocationName(state),
      locationType: getPickUpLocationType(state),
      poi: {
        latitude: getPickUpLocationLat(state),
        longitude: getPickUpLocationLng(state),
        radius: 0,
      },
    },
    returnPointInfo: {
      cityId: getDropOffCityId(state),
      date: moment(getDropOffTime(state)).format('YYYY-MM-DD HH:mm:ss'),
      locationCode: getDropOffLocationCode(state),
      locationName: getDropOffLocationName(state),
      locationType: getDropOffLocationType(state),
      poi: {
        latitude: getDropOffLocationLat(state),
        longitude: getDropOffLocationLng(state),
        radius: 0,
      },
    },
    searchType: 1,
    now: new Date(),
  };
};

const getCurPromotionFilter = () => {
  let curPromotionFilter = null;
  const promotionFilterItems = getPromotionFilterItems();
  if (promotionFilterItems && promotionFilterItems.length > 0) {
    curPromotionFilter = promotionFilterItems[0];
  }
  return curPromotionFilter;
};


export const getPromotionFilterText = () => {
  let text = '';
  const curPromotionFilter = getCurPromotionFilter();
  if (curPromotionFilter) {
    text = curPromotionFilter.filterGroups[0].filterItems[0].name;
  }
  return text;
};

export const getPromotionFilterCode = () => {
  let code = '';
  const curPromotionFilter = getCurPromotionFilter();
  if (curPromotionFilter) {
    code = curPromotionFilter.filterGroups[0].filterItems[0].itemCode;
  }
  return code;
};

export const getPromotionFilterIsSelect = state => getSelectedFilters(state).bitsFilter.includes(getPromotionFilterCode());
