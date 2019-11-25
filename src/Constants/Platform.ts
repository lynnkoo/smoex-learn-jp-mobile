export const ENV_TYPE = {
  FAT: 'fat',
  UAT: 'uat',
  BATTLE: 'battle',
  PROD: 'prd',
};

export const DOMAIN_URL = {
  [ENV_TYPE.FAT]: 'gateway.m.fws.qa.nt.ctripcorp.com',
  [ENV_TYPE.UAT]: 'gateway.m.uat.qa.nt.ctripcorp.com',
  [ENV_TYPE.BATTLE]: 'gateway.m.fws.qa.nt.ctripcorp.com',
  [ENV_TYPE.PROD]: 'm.ctrip.com',
};

export const APP_TYPE = {
  CTRIP_ISD: 'CTRIP_ISD',
  CTRIP_OSD: 'CTRIP_OSD',
  TRIP: 'TRIP',
  UNKNOW: 'UNKNOW',
};

export const APP_ID = {
  TRIP: '37',
  CTRIP: '999999',
};

export const BUSINESS_TYPE = {
  TRIP: 34,
  CTRIP_OSD: 34,
  CTRIP_ISD: 35,
};

// // origin Channel type
// export const CHANNEL_TYPE = {
//   ISD: 'rn_car_isd',
//   OSD: 'rn_car_osd',
//   IBU: 'rn_ibu_car',
// };

// all-in-one new channel, distinguish Trip and Ctrip
export const CHANNEL_TYPE_UNION = {
  CTRIP: 'rn_car_app',
  TRIP: 'rn_ibu_car_app',
};

export const SHARK_APP_ID = {
  TRIP: 37009,
};

export const REST_SOA = 'restapi/soa2';
