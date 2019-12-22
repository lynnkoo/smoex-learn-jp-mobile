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
