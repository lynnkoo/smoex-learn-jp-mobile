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

export const REST_SOA = 'restapi/soa2';
