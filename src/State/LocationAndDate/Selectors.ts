export const getLocationAndDate = state => state.LocationAndDate;

export const getPickUpTime = state => state.LocationAndDate.rentalDate.pickUp.dateTime;

export const getDropOffTime = state => state.LocationAndDate.rentalDate.dropOff.dateTime;

export const getPickUpCityId = state => state.LocationAndDate.rentalLocation.pickUp.cid;

export const getPickUpLocationType = state => state.LocationAndDate.rentalLocation.pickUp.area.type;

export const getPickUpLocationCode = state => state.LocationAndDate.rentalLocation.pickUp.area.id;

export const getPickUpLocationName = state => state.LocationAndDate.rentalLocation.pickUp.area.name;

export const getPickUpLocationLat = state => state.LocationAndDate.rentalLocation.pickUp.area.lat;

export const getPickUpLocationLng = state => state.LocationAndDate.rentalLocation.pickUp.area.lng;

export const getDropOffCityId = state => state.LocationAndDate.rentalLocation.dropOff.cid;

export const getDropOffLocationType = state => state.LocationAndDate.rentalLocation.dropOff.area.type;

export const getDropOffLocationCode = state => state.LocationAndDate.rentalLocation.dropOff.area.id;

export const getDropOffLocationName = state => state.LocationAndDate.rentalLocation.dropOff.area.name;

export const getDropOffLocationLat = state => state.LocationAndDate.rentalLocation.dropOff.area.lat;

export const getDropOffLocationLng = state => state.LocationAndDate.rentalLocation.dropOff.area.lng;

export const getIsOneWay = state => state.LocationAndDate.rentalLocation.isOneWay;

export const getRentalLocation = state => state.LocationAndDate.rentalLocation;

export const getRentalDate = state => state.LocationAndDate.rentalDate;
