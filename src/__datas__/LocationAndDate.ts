
import moment from 'moment';

export const initDatePickup = moment()
  .startOf('hour')
  .add(7, 'd')
  .hours(10);
export const initDateDropoff = moment()
  .startOf('hour')
  .add(14, 'd')
  .hours(10);

export const initRentalLocation = {
  pickUp: {
    cid: 347,
    cname: '洛杉矶',
    country: '美国',
    realcountry: '美国',
    area: {
      id: 'LAX',
      name: '洛杉矶国际机场',
      lat: 33.941589,
      lng: -118.40853,
      type: '1',
    },
  },
  dropOff: {
    cid: 347,
    cname: '洛杉矶',
    country: '美国',
    realcountry: '美国',
    area: {
      id: 'LAX',
      name: '洛杉矶国际机场',
      lat: 33.941589,
      lng: -118.40853,
      type: '1',
    },
  },
  isShowDropOff: false,
};
