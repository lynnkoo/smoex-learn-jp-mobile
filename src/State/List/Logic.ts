import { createLogic } from 'redux-logic';
import uuid from 'uuid';
import {
  FETCH_LIST, FETCH_LIST_BATCH, FETCH_LIST_CALLBACK, SET_GROUPID,
} from './Types';
import { ApiResCode } from '../../Constants/Index';
import { ListReqAndResData, ListResSelectors } from '../../Global/Cache/Index';
import {
  setStatus, initActiveGroupId, fetchApiList, fetchApiListCallback, setBatchRequest, reset,
} from './Actions';
import { CarFetch } from '../../Util/Index';
import { packageListReqParam } from './Mappers';
import { getVehGroupList } from '../../Global/Cache/ListResSelectors';

const REQUEST_COUNT = 2;
const batchGroups = [0, 1];

export const apiListBatchQuery = createLogic({
  type: FETCH_LIST_BATCH,
  latest: true,
  /* eslint-disable no-empty-pattern */
  async process({ }, dispatch, done) {
    dispatch(reset());
    const requestId = uuid();
    batchGroups.forEach((m) => {
      dispatch(fetchApiList({ vendorGroup: m, requestId }));
    });
    done();
  },
});

export const apiListQueryProducts = createLogic({
  type: FETCH_LIST,
  // latest: true,
  /* eslint-disable no-empty-pattern */
  async process({ action, getState }, dispatch, done) {
    // 获取请求的批次
    // @ts-ignore
    const param = packageListReqParam(getState(), action.data);
    const res = await CarFetch.getListProduct(param); // todo catch
    dispatch(fetchApiListCallback({ param, res }));
    done();
  },
});

export const apiListQueryProductsCallback = createLogic({
  type: FETCH_LIST_CALLBACK,
  // latest: true,
  async process({ action, getState }, dispatch, done) {
    // @ts-ignore
    const { param, res } = action.data || {};
    // const isSuccess = (res && res.baseResponse && res.baseResponse.isSuccess) || false; // todo
    const isSuccess = (res && res.productGroups && res.productGroups.length > 0) || false;
    const resCode = res && res.baseResponse && res.baseResponse.code;
    if (isSuccess && (resCode === ApiResCode.ListResCode.C200 || resCode === ApiResCode.ListResCode.C201)) {
      ListReqAndResData.setData(ListReqAndResData.keyList.listProductRes, res);
      const initGId = res.productGroups[0].groupCode;
      dispatch(initActiveGroupId({ activeGroupId: initGId })); // todo allcars
    }

    // @ts-ignore
    const newBatchesRequest = getState().List.batchesRequest;
    // 记录当前响应的结果
    const curRequest = newBatchesRequest.find(f => f.vendorGroup === param.vendorGroup);
    if (!curRequest) {
      newBatchesRequest.push({ vendorGroup: param.vendorGroup, resCode, result: isSuccess ? 1 : -1 });
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
    const curProgress = totalCount >= REQUEST_COUNT ? 1 : (totalCount > 0 ? 0.6 : 0);
    const has200 = newBatchesRequest.find(f => f.resCode === ApiResCode.ListResCode.C200);
    // 当前页面有数据展示，则不展示loading
    const curPageResData = ListResSelectors.getBaseResData();
    const hasResult = (curPageResData && curPageResData.productGroups && curPageResData.productGroups.length > 0) || false;
    const nextIsLoading = (hasResult || has200) ? false : curProgress === 0;
    const nextFailed = hasResult ? false : (has200 ? true : curProgress === 1); // todo 待确认, 如果是第一批失败的话, 是否会展示白屏？
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
