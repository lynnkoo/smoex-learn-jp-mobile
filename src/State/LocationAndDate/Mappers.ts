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
 * @param {boolean} isOneWay 是否关闭异地取还按钮
 * @returns {any}
  {
    pickUp: {...}, // 见 formatLocationFromEvent to
    dropOff: {...},
    isShowDropOff: false,
  }
 */
export const getLoactionFromEvent = (data, isOneWay) => {
  const { pickup, dropoff } = data;
  const res: any = {};
  res.pickUp = pickup && formatLocationFromEvent(pickup);
  if (isOneWay) {
    res.dropOff = res.pickUp;
  } else {
    res.dropOff = dropoff && formatLocationFromEvent(dropoff);
  }
  return res;
};
