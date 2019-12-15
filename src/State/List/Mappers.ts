import { getAge, getAdultNumbers, getChildNumbers } from '../DriverAgeAndNumber/Selectors';
import {
  getPickUpTime,
  getDropOffTime,
  getPickUpCityId,
  getPickUpLocationCode,
  getPickUpLocationName,
  getPickUpLocationType,
  getPickUpLocationLat,
  getPickUpLocationlng,
  getDropOffCityId,
  getDropOffLocationCode,
  getDropOffLocationName,
  getDropOffLocationType,
  getDropOffLocationLat,
  getDropOffLocationlng,
} from '../LocationAndDate/Selectors';

/* eslint-disable import/prefer-default-export */
export const packageListReqParam = state => ({
  age: getAge(state),
  adultNumbers: getAdultNumbers(state),
  childrenNumbers: getChildNumbers(state),
  pickupPointInfo: {
    cityId: getPickUpCityId(state),
    date: getPickUpTime(state),
    locationCode: getPickUpLocationCode(state),
    locationName: getPickUpLocationName(state),
    locationType: getPickUpLocationType(state),
    poi: {
      latitude: getPickUpLocationLat(state),
      longitude: getPickUpLocationlng(state),
      radius: 0,
    },
  },
  returnPointInfo: {
    cityId: getDropOffCityId(state),
    date: getDropOffTime(state),
    locationCode: getDropOffLocationCode(state),
    locationName: getDropOffLocationName(state),
    locationType: getDropOffLocationType(state),
    poi: {
      latitude: getDropOffLocationLat(state),
      longitude: getDropOffLocationlng(state),
      radius: 0,
    },
  },
});
