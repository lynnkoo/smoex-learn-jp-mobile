import _ from 'lodash';
import { getStore } from '../../State/Store';
import { getLogData } from '../../State/List/Selectors';

/** 列表页接口的请求+响应数据 */
let reqAndResData = {
  listProductReq: null,
  listProductRes: null,
};

/** 埋点数据结构
 * selectedFilters [] 规则: sortFilter + filterLabels, ','拼接
 * key string 规则: keyObj.value,  ','拼接
    {
      queryVid: {
        groupId: {
          selectedFilters: {
            key: {
              vehicleIndex: 0,
              vendorIndex: 0,
              vehicleCode: '',
              bizVendorCode: ''
            }
          }

          ]
        }
      }
    }
 */
let exposureData = {};

export default class ListReqAndResData {
  static keyList = {
    listProductReq: 'listProductReq',
    listProductRes: 'listProductRes',
    listProductSearchCondition: 'listProductSearchCondition',
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

export const getExposureData = () => {
  const res = {};
  _.forEach(exposureData, (queryVidObj, queryVid) => {
    _.forEach(queryVidObj, (groupIdObj, groupId) => {
      _.forEach(groupIdObj, (selectedFiltersObj, selectedFilterString) => {
        const path = [queryVid, groupId, selectedFilterString];
        _.setWith(res, path, _.values(selectedFiltersObj), Object);
      });
    });
  });
  return res;
};

export const getLogDataFromState = () => {
  const state = getStore().getState();
  const { queryVid, groupId, selectedFilters } = getLogData(state);
  const { filterLabels, sortFilter } = selectedFilters;
  const labels = _.map(filterLabels, ({ name }) => name);
  const selectedFilterString = [sortFilter, ...labels].sort().join(',');
  return {
    queryVid, groupId, selectedFilters: selectedFilterString,
  };
};

export const setExposureKey = (data) => {
  const { queryVid, groupId, selectedFilters } = getLogDataFromState();
  const path = [queryVid, groupId, selectedFilters];
  const obj = _.get(exposureData, path, {});
  _.setWith(exposureData, path, {
    ...obj,
    [_.values(data).sort().join(',')]: data,
  }, Object);
};

export const removeExposureData = () => {
  exposureData = {};
};
