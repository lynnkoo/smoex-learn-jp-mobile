import moment from 'moment';
import { getAdultNumbers, getChildNumbers } from '../DriverAgeAndNumber/Selectors';
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

/* eslint-disable import/prefer-default-export */
export const packageListReqParam = (state, data: { vendorGroup: number, requestId: string }) => ({
  requestId: data.requestId,
  vendorGroup: data.vendorGroup,
  // age: getAge(state), // todo
  age: 30,
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
  requestType: 1, // todo
});
