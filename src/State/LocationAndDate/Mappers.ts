import moment from 'moment';
import { Utils } from '../../Util/Index';
import { CtripOsdInitRentalLocation } from '../../__datas__/LocationAndDate';

export const placeHolder = null;

/**
 * format rental loaction data
 * @param {any} location
  {
    id: "HKT"
    locationName: "布吉國際機場 (HKT)"
    cityName: "布吉島"
    countryName: "泰國"
    latitude: 8.111095
    longtitude: 98.306465
    countryId: 4
    _cid: "ccd23fb4-9004-4ed0-b22a-fd6c8fc84f2d"
    locationCode: "HKT"
    locationType: 1
    cityId: 725
    timezone: 7
  }
 * @returns {any}
  {
    cid: 617,
    cname: '台北',
    country: '中國',
    area: {
      id: 'TPE',
      name: '桃園機場 (TPE)',
      lat: 25.079651,
      lng: 121.234217,
      type: 1,
    },
  }
 */
const formatLocationFromEvent = (location) => {
  const {
    id,
    locationName,
    cityName,
    countryName,
    latitude,
    longtitude,
    countryId,
    locationType,
  } = location;
  return {
    cid: countryId,
    cname: cityName,
    country: countryName,
    area: {
      id,
      name: locationName,
      lat: latitude,
      lng: longtitude,
      type: locationType,
    },
  };
};

/**
 * format rental loaction data
 * @param {any} data
  {
    pickup: {...}, // 见 formatLocationFromEvent from
    dropoff: {...},
  }
 * @param {boolean} isShowDropOff 是否异地取还
 * @returns {any}
  {
    pickUp: {...}, // 见 formatLocationFromEvent to
    dropOff: {...},
    isShowDropOff: false,
  }
 */
// eslint-disable-next-line
export const getLoactionFromEvent = (data, isShowDropOff) => {
  const { pickup, dropoff } = data;
  const res: any = {};
  res.pickUp = pickup && formatLocationFromEvent(pickup);
  
  // 和国际站首页逻辑保持一致
  // 异地开关开时，更改取车地点，同时更改还车地点
  res.dropOff = res.pickUp;
  if (dropoff) {
    res.dropOff = formatLocationFromEvent(dropoff);
  }

  // ctrip 逻辑
  // 异地开关开时，更改取车地点，不更改还车地点
  // if (isShowDropOff) {
  //   res.dropOff = dropoff && formatLocationFromEvent(dropoff);
  // } else {
  //   res.dropOff = res.pickUp;
  // }
  return res;
};

export const getInitPTime = () => {
  const pTime = moment();
  if (Utils.isTrip()) {
    pTime.add(2, 'd').startOf('hour').hours(10);
  } else if (Utils.isCtripOsd()) {
    pTime.add(7, 'd').startOf('hour').hours(10);
  } else if (Utils.isCtripIsd()) {
    // todo 国内初始时间的处理
  }

  return pTime;
};

export const getInitRTime = () => getInitPTime().add(Utils.getRentalGap(), 'd');

export const getInitLocationInfo = () => {
  if (Utils.isTrip()) {
    // 开发环境时 默认先取ctrip的, 为了满足列表页请求需要默认参数。若后面接了首页后,可以去除。
    /* eslint-disable */
    if (__DEV__) {
      return CtripOsdInitRentalLocation;
    }
  } else if (Utils.isCtripOsd()) {
    return CtripOsdInitRentalLocation;
  } else if (Utils.isCtripIsd) {
    // todo 国内初始地点的处理
  }

  return null;
};
