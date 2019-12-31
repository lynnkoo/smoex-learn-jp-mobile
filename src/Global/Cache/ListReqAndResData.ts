import _ from 'lodash';
import { getVehicleList, getBaseProductGroups } from './ListResSelectors';

/** 列表页接口的请求+响应数据 */
let reqAndResData = {
  listProductReq: null,
  listProductRes: null,
};

let exposureData = {};

export default class ListReqAndResData {
  static keyList = {
    listProductReq: 'listProductReq',
    listProductRes: 'listProductRes',
  };

  static getData = (key: string) => reqAndResData[key];

  static setData = (key, data) => {
    reqAndResData[key] = data;
  };

  static removeData = () => {
    reqAndResData = {
      listProductReq: null,
      listProductRes: null,
    };
  }
}

export const getExposureKeys = () => _.keys(exposureData);

export const getExposureData = () => {
  const keys = getExposureKeys();
  const vehicleList = getVehicleList() || [];
  const productGroups = getBaseProductGroups() || [];
  const res = [];
  // 只在全部车型下面查找即可
  const allProductList = _.reduce(productGroups, (result, { productList }) => [
    ...productList,
    ...result,
  ], []);
  if (productGroups) {
    _.forEach(keys, (key) => {
      const [vehicleCode, bizVendorCode] = key.split('|');
      const { vendorPriceList }: any = _.find(allProductList, { vehicleCode }) || {};
      const vehicle = _.find(vehicleList, { vehicleCode });
      const vendor = _.find(
        vendorPriceList,
        vendorItem => vendorItem.reference.bizVendorCode === bizVendorCode,
      );
      if (vehicle) {
        res.push({
          vehicle,
          vendor: _.omit(vendor, ['filterAggregations']),
        });
      }
    });
  }

  return res;
};

export const setExposureKey = (key) => {
  exposureData[key] = true;
};

export const removeExposureData = () => {
  exposureData = {};
};
