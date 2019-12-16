import moment from 'moment';

export const getLocationAndDate = state => state.LocationAndDate;

export const getRentalDate = state => getLocationAndDate(state).rentalDate;

export const getPickUpTime = state => state.LocationAndDate.rentalDate.pickUp.dateTime;

export const getDropOffTime = state => state.LocationAndDate.rentalDate.dropOff.dateTime;

export const getRentalLocation = state => state.LocationAndDate.rentalLocation;

export const getPickUpCityId = state => state.LocationAndDate.rentalLocation.pickUp.cid;

export const getPickUpLocationType = state => state.LocationAndDate.rentalLocation.pickUp.area.type;

export const getPickUpLocationCode = state => state.LocationAndDate.rentalLocation.pickUp.area.id;

export const getPickUpLocationName = state => state.LocationAndDate.rentalLocation.pickUp.area.name;

export const getPickUpLocationLat = state => state.LocationAndDate.rentalLocation.pickUp.area.lat;

export const getPickUpLocationlng = state => state.LocationAndDate.rentalLocation.pickUp.area.lng;

export const getDropOffCityId = state => state.LocationAndDate.rentalLocation.dropOff.cid;

export const getDropOffLocationType = state => state.LocationAndDate.rentalLocation.dropOff.area.type;

export const getDropOffLocationCode = state => state.LocationAndDate.rentalLocation.dropOff.area.id;

export const getDropOffLocationName = state => state.LocationAndDate.rentalLocation.dropOff.area.name;

export const getDropOffLocationLat = state => state.LocationAndDate.rentalLocation.dropOff.area.lat;

export const getDropOffLocationlng = state => state.LocationAndDate.rentalLocation.dropOff.area.lng;

export const getFormatRentalDate = (state, formatTemp = 'YYYYMMDDHHmmss') => {
  const rentalDate = getRentalDate(state) || {};
  const { pickUp = {}, dropOff = {} } = rentalDate;
  return {
    pickUp: {
      dateTime: moment(pickUp.dateTime).format(formatTemp),
    },
    dropOff: {
      dateTime: moment(dropOff.dateTime).format(formatTemp),
    },
  };
};

export const getFormatLocationAndDate = state => ({
  rentalDate: getFormatRentalDate(state),
  rentalLocation: getRentalLocation(state),
});
