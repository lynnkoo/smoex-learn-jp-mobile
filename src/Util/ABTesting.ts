import { ABTesting, Util } from '@ctrip/crn';
import AppContext from './AppContext';

export interface AbItemType {
  key: string,
  defaultValue: string,
  isActive: boolean,
  noVersionVal: boolean,
  isSync: boolean,
}

export interface AbResultType {
  ExpCode: string,
  BeginTime: string,
  EndTime: string,
  ExpVersion: string,
  ExpDefaultVersion: string,
  State: boolean,
  Attrs: any,
  ExpResult: any,
}

export const AbTestingKey = {
  // ListSort: {
  //   key: '190711_var_olist',
  //   defaultValue: 'B',
  //   isActive: true,
  //   noVersionVal: true,
  //   isSync: true,
  // },
  // PredictCache: {
  //   key: '190718_var_osdap',
  //   defaultValue: 'B',
  //   isActive: true,
  //   noVersionVal: true,
  //   isSync: false,
  // },
  // Booking: {
  //   key: '190423_var_write',
  //   defaultValue: 'B',
  //   isActive: true,
  //   noVersionVal: true,
  //   isSync: false,
  // },
  // IndexSearchBar: {
  //   key: '190708_var_chome',
  //   defaultValue: 'B',
  //   isActive: true,
  //   noVersionVal: true,
  //   isSync: false,
  // },
  List: {
    key: '191210_DSJT_list',
    defaultValue: 'B',
    isActive: true,
    noVersionVal: true,
    isSync: true,
  },
};

const getActiveAbs = (isSync: boolean) => Object.keys(AbTestingKey)
  .filter(m => AbTestingKey[m].isActive && AbTestingKey[m].isSync === isSync);

const getABsExpCodes = (keys: Array<string>) => {
  const expDatas = [];
  keys.map(m => expDatas.push({ expCode: AbTestingKey[m].key }));
  return expDatas;
};

const getIsSyncAbs = (isSync: boolean) => () => getABsExpCodes(getActiveAbs(isSync));

const AbIsTrue = (result: AbResultType, defaultAb: AbItemType) => {
  const version = result && result.ExpVersion;
  if (version) {
    return version.toUpperCase() === defaultAb.defaultValue;
  }
  return defaultAb.noVersionVal;
};

const getAbsExpCodes = getIsSyncAbs(false);

const getAbsExpCodesSync = getIsSyncAbs(true);


const getAbs = () => {
  let expCodes = getAbsExpCodes();
  if (Util.isInChromeDebug) {
    expCodes = expCodes.concat(getAbsExpCodesSync());
  }

  // @ts-ignore
  ABTesting.getMultiABTestingInfo(expCodes, (result) => {
    AppContext.setABTesting(result);
  });
};

const getAbsSync = () => {
  const expCodes = getAbsExpCodesSync();
  // @ts-ignore
  const result = ABTesting.getMultiABTestingInfoSync(expCodes);
  AppContext.setABTesting(result);
};

export const getAbBoolean = (AbInfo: AbItemType) => {
  const Ab = AppContext.ABTesting.datas[AbInfo.key];
  return AbIsTrue(Ab, AbInfo);
};

export const getAbExpVersion = (AbInfo: AbItemType) => (
  AppContext.ABTesting.datas[AbInfo.key].ExpVersion
);

export const initialiseABTesting = () => {
  // sync
  if (!Util.isInChromeDebug) {
    getAbsSync();
  }
  // async
  getAbs();
};
