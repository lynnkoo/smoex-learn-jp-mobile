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
  ISD_C_APP: 'ISD_C_APP',
  ISD_C_H5: 'ISD_C_H5',
  ISD_Q_APP: 'ISD_Q_APP',
  ISD_ZUCHE_APP: 'ISD_ZUCHE_APP',
  OSD_C_APP: 'OSD_C_APP',
  OSD_C_H5: 'OSD_C_H5',
  OSD_T_APP: 'OSD_T_APP',
  OSD_T_H5: 'OSD_T_H5',
  OSD_Q_APP: 'OSD_Q_APP',
  OSD_ZUCHE_APP: 'OSD_ZUCHE_APP',
  UNKNOW: 'UNKNOW',
};

export const APP_ID = {
  TRIP: '37',
  CTRIP: '999999',
  ZUCHE: '5010',
};

export const CHANNEL_TYPE = {
  ISD: 'rn_car_isd',
  OSD: 'rn_car_osd',
  IBU: 'rn_ibu_car',
};

export const CHANNEL_TYPE_UNION = {
  CTRIP: 'rn_car_app',
  TRIP: 'rn_ibu_car_app',
};

export const SHARK_APP_ID = {
  TRIP: 37009,
};

export const REST_SOA = 'restapi/soa2';

export const BUSINESS_TYPE = {
  ISD: '35',
  OSD: '34',
  IBU: '34',
  UNKNOW: 'UNKNOW',
};

export const CHANNEL_ID = {
  CTRIP_DEFAULT: '14277',
  CTRIP_MAIN_APP: '7',
  CTRIP_MAIN_H5: '5',
  ZUCHE: '610',
};
