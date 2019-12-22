// This file is used to record the response record of the interface
import { CarLog } from '../../Util/Index';
import { ApiResCode } from '../../Constants/Index';

// Record every response of the list page for analysis of missing quotes
export const LogListEachTrace = (isError, param, res) => {
  const isSuccess = !isError && res && res.baseResponse && res.baseResponse.isSuccess;
  const resCode = res && res.baseResponse && res.baseResponse.code;
  let resStr = '';
  if (res && res.baseResponse) resStr = JSON.stringify(res.baseResponse);
  CarLog.LogTrace({
    key: '122790',
    info: {
      eventResult: isSuccess,
      request: JSON.stringify(param),
      baseResponse: resStr,
      resCode,
      errorCode: isError ? ApiResCode.TraceCode.E1001 : '',
      serverErrorCode: (res && res.baseResponse && res.baseResponse.errorCode) || '',
      serverErrorMsg: (res && res.baseResponse && res.baseResponse.message) || '',
      // @ts-ignore
      fetchCost: new Date() - param.now,
    },
  });
};

// Record the actual data displayed on the list page after all requests are completed
export const LogListFinalTrace = (param, res) => {
  const isSuccess = (res && res.productGroups && res.productGroups.length > 0) || false;
  const vehCodeList = [];
  let vehCount = 0;
  const groupCodeList = [];
  let pPricecount = 0;
  let pNormalcount = 0;
  let pEasylifecount = 0;
  let pMaskvehiclecount = 0;
  let pZhimaCount = 0;
  const vendorNames = [];
  let vendorCount = 0;
  if (res && res.vehicleList) {
    vehCount = res.vehicleList.length;
    res.vehList.forEach((m) => {
      vehCodeList.push(m.vehicleCode);
    });
  }
  if (res && res.productGroups && res.productGroups.length) {
    res.productGroups.forEach((m) => {
      groupCodeList.push(m.groupCode);
      if (m.productList) {
        m.productList.forEach((mp) => {
          if (mp.vendorPriceList) {
            pPricecount += mp.vendorPriceList.length; // 车型总数量
            mp.vendorPriceList.forEach((pItem) => {
              if (pItem.easyLifeInfo && pItem.easyLifeInfo.isEasyLife) {
                pEasylifecount += 1;
              } else {
                pNormalcount += 1;
              }
              pMaskvehiclecount += pItem.reference && pItem.reference.decoratorVendorType === 2 ? 1 : 0;
              pZhimaCount += (pItem.extMap && pItem.extMap.isSupportZhima === 'true') ? 1 : 0;
            });
          }
        });
      }
    });
  }
  if (res && res.filterMenuItems && res.filterMenuItems.length) {
    const vendor = res.filterMenuItems.find(f => f.code === 'vendor');
    if (vendor) {
      vendor.filterGroups.forEach((m) => {
        m.filterItems.forEach((m2) => {
          vendorCount += 1;
          vendorNames.push(m2.name);
        });
      });
    }
  }
  let recommendInfo = '';
  if (res && res.recommendInfo) {
    recommendInfo = JSON.stringify(res.recommendInfo);
  }

  CarLog.LogTrace({
    key: '122791',
    info: {
      eventResult: isSuccess,
      request: JSON.stringify(param),
      serverErrorCode: (res && res.baseResponse && res.baseResponse.errorCode) || '',
      serverErrorMsg: (res && res.baseResponse && res.baseResponse.message) || '',
      vehicleList: vehCodeList.toString(),
      vehicleCount: `${vehCount}`,
      groupList: groupCodeList.toString(),
      priceCount: `${pPricecount}`,
      normalCount: `${pNormalcount}`,
      easyLifeCount: `${pEasylifecount}`,
      maskVehicleCount: `${pMaskvehiclecount}`,
      zhimaCount: `${pZhimaCount}`,
      vendorNames: vendorNames.toString(),
      vendorCount: `${vendorCount}`,
      recommendInfo,
    },
  });
};
