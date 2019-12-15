import { createLogic } from 'redux-logic';
import {
  FETCH_LIST, FETCH_LIST_BATCH, FETCH_LIST_CALLBACK, SET_GROUPID,
} from './Types';
import { ApiResCode } from '../../Constants/Index';
import { ListReqAndResData, ListResSelectors } from '../../Global/Cache/Index';
import {
  setStatus, initActiveGroupId, fetchApiList, fetchApiListCallback, setBatchRequest,
} from './Actions';
// import { CarFetch } from '../../Util/Index';
import { ListProductRes } from '../../../__mocks__/ListMockData';
import { getVehGroupList } from '../../Global/Cache/ListResSelectors';


// 组装列表页请求数据 - todo 放在mapping里面
/* eslint-disable no-unused-vars */
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
const REQUEST_COUNT = 2;

export const apiListBatchQuery = createLogic({
  type: FETCH_LIST_BATCH,
  latest: true,
  /* eslint-disable no-empty-pattern */
  async process({}, dispatch, done) {
    const batchGroups = new Array(REQUEST_COUNT);
    [0, 1].forEach(() => {
      console.log('测试+++FETCH_LIST_BATCH');
      dispatch(fetchApiList());
    });
    done();
  },
});

export const apiListQueryProducts = createLogic({
  type: FETCH_LIST,
  latest: true,
  /* eslint-disable no-empty-pattern */
  async process({}, dispatch, done) {
    // test
    // const param = packageListReqParam();
    // const res = await CarFetch.getListProduct(param);
    const res = ListProductRes;
    console.log('测试+++res', res);
    dispatch(fetchApiListCallback(res));
    done();
  },
});

export const apiListQueryProductsCallback = createLogic({
  type: FETCH_LIST_CALLBACK,
  latest: true,
  async process({ action, getState }, dispatch, done) {
    // @ts-ignore
    const res = action.data || {};
    const isSuccess = res && res.baseResponse && res.baseResponse.isSuccess;
    const resCode = res.baseResponse && res.baseResponse.code;
    if (isSuccess && (resCode === ApiResCode.ListResCode.C200 || resCode === ApiResCode.ListResCode.C201)) {
      ListReqAndResData.setData(ListReqAndResData.keyList.listProductRes, res);
      const initGId = res.productGroups[0].groupCode;
      dispatch(initActiveGroupId({ activeGroupId: initGId }));
    }

    // @ts-ignore
    const newBatchesRequest = getState().List.batchesRequest;
    // 记录当前响应的结果
    const curRequest = newBatchesRequest.find(f => f.resCode === resCode);
    if (!curRequest) {
      newBatchesRequest.push({ resCode, result: isSuccess ? 1 : -1 });
      dispatch(setBatchRequest(newBatchesRequest.length >= REQUEST_COUNT ? [] : newBatchesRequest));
    }
    // 计算当前响应的总次数
    let successCount = 0;
    let failCount = 0;
    newBatchesRequest.forEach((m) => {
      if (m.result === 1) successCount += 1;
      if (m.result === -1) failCount += 1;
    });
    const totalCount = +successCount + +failCount;
    // 计算进度条的进度值
    const curProgress = totalCount >= REQUEST_COUNT ? 1 : (totalCount > 0 ? 0.3 : 0);
    const has200 = newBatchesRequest.find(f => f.resCode === ApiResCode.ListResCode.C200);
    // 当前页面有数据展示，则不展示loading
    const curPageResData = ListResSelectors.getBaseResData();
    const hasResult = (curPageResData && curPageResData.productList && curPageResData.productList.length) || false;
    const nextIsLoading = (hasResult || has200) ? false : curProgress === 0;
    const nextFailed = hasResult ? false : (has200 ? true : curProgress === 1); // todo 待确认, 如果是第一批失败的话, 会展示白屏
    const nextProgress = (hasResult || !has200) ? curProgress : 1;
    dispatch(setStatus({ isLoading: nextIsLoading, isFail: nextFailed, progress: nextProgress }));

    done();
  },
});

export const setGroupIdByIndex = createLogic({
  type: SET_GROUPID,
  transform({ action }: any, next) {
    const data = action.data || {};
    const { activeGroupIndex, ...passThroughData } = data;
    if (activeGroupIndex !== undefined) {
      const vehGroup = getVehGroupList()[activeGroupIndex] || {};
      const activeGroupId = vehGroup.gId;
      if (activeGroupId) {
        next({
          ...action,
          data: {
            activeGroupId,
            ...passThroughData,
          },
        });
        return;
      }
    }
    next(action);
  },
});

export default [
  apiListBatchQuery,
  apiListQueryProducts,
  apiListQueryProductsCallback,
  setGroupIdByIndex,
];
