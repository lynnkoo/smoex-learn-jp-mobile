// import { CarFetch } from '../../Util/Index';
import { ListProductRes } from '../../../__mocks__/ListMockData';
// import { ListReqAndResData } from '../Cache/Index';

/** 列表页公共的接口调用 */


const batchGroups = [1, 0];

// 组装列表页请求参数
// todo
const packageListReqParam = () => ({
  age: 30,
  adultNumbers: 2,
  childrenNumbers: 2,
  pickupPointInfo: {
    cityId: 347,
    date: '2019-12-10 10:00:00',
    locationCode: 'LAX',
    locationType: 1,
    poi: {
      latitude: 33.941589,
      longitude: -118.40853,
      radius: 0,
    },
  },
  returnPointInfo: {
    cityId: 347,
    date: '2019-12-19 10:00:00',
    locationCode: 'LAX',
    locationType: 1,
    poi: {
      latitude: 33.941589,
      longitude: -118.40853,
      radius: 0,
    },
  },
});

export const apiListQueryProducts = async (param, callback, m) => {
  const result = {
    isSuccess: false,
    resCode: '',
    soaTotal: 0,
    res: null,
  };
  // todo
  // const res = await CarFetch.getListProduct(param);
  const res = ListProductRes;
  // test
  setTimeout(() => {
    result.isSuccess = true;
    result.resCode = m === 0 ? '201' : '200';
    result.res = res;
    callback(result);
  }, 2000);
};

export const apiListBatchQuery = (callback) => {
  const param = packageListReqParam();
  batchGroups.forEach((m) => {
    apiListQueryProducts(param, callback, m);
  });
};
