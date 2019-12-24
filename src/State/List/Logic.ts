import { createLogic } from 'redux-logic';
import uuid from 'uuid';
import _ from 'lodash';
import {
  FETCH_LIST, FETCH_LIST_BATCH, FETCH_LIST_CALLBACK, SET_GROUPID, DELETE_SELECTED_FILTER,
} from './Types';
import { ApiResCode, FrontEndConfig } from '../../Constants/Index';
import { ListReqAndResData, ListResSelectors } from '../../Global/Cache/Index';
import {
  setStatus, initActiveGroupId, fetchApiList, fetchApiListCallback, setBatchRequest, reset, updateSelectedFilter,
} from './Actions';
import { CarFetch } from '../../Util/Index';
import { packageListReqParam } from './Mappers';
import { getVehGroupList } from '../../Global/Cache/ListResSelectors';
import * as UBTLog from './UBTLog';


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
  /* eslint-disable no-empty-pattern */
  async process({ action, getState }, dispatch, done) {
    // 获取请求的批次
    // @ts-ignore
    const param = packageListReqParam(getState(), action.data);
    const res = await CarFetch.getListProduct(param).catch((error) => {
      dispatch(fetchApiListCallback({ isError: true, param, res: error }));
      done();
    });
    dispatch(fetchApiListCallback({ isError: false, param, res }));
    done();
  },
});

export const apiListQueryProductsCallback = createLogic({
  type: FETCH_LIST_CALLBACK,
  async process({ action, getState }, dispatch, done) {
    // @ts-ignore
    const { param, res, isError } = action.data || {};
    const isSuccess = (res && res.baseResponse && res.baseResponse.isSuccess) || false;
    const resCode = res && res.baseResponse && res.baseResponse.code;
    // log
    UBTLog.LogListEachTrace(isError, param, res);
    // @ts-ignore
    const { batchesRequest, progress } = getState().List;
    const newBatchesRequest = batchesRequest;
    // 记录当前响应的结果
    const prePageResData = ListResSelectors.getBaseResData();
    const preHasResult = (prePageResData && prePageResData.productGroups && prePageResData.productGroups.length > 0) || false;
    const condition1 = resCode === ApiResCode.ListResCode.C201 && progress !== 1;
    const condition2 = resCode === ApiResCode.ListResCode.C200 && isSuccess;
    const condition3 = resCode === ApiResCode.ListResCode.C200 && !isSuccess && !preHasResult;
    // resCode为200的场景下拆分成两个条件判断的原因是：
    // ①需满足当第一批201有数据，但第二批200没数据时，页面仍需正常展示的场景
    // ②需满足当第一批201无数据，第二批也无数据时，页面的无结果推荐需读接口返回的
    if (condition1 || condition2 || condition3) {
      ListReqAndResData.setData(ListReqAndResData.keyList.listProductRes, res);
    }

    if (isSuccess) {
      const initGId = FrontEndConfig.AllCarsConfig.groupCode;
      dispatch(initActiveGroupId({ activeGroupId: initGId }));
    }
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
    const nextFailed = hasResult ? false : (has200 ? true : curProgress === 1);
    const nextProgress = has200 ? 1 : curProgress;
    dispatch(setStatus({ isLoading: nextIsLoading, isFail: nextFailed, progress: nextProgress }));
    if (nextProgress === 1) {
      UBTLog.LogListFinalTrace(param, curPageResData);
    }
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

export const deleteSelectedFilter = createLogic({
  type: DELETE_SELECTED_FILTER,
  async process({ action, getState }, dispatch, done) {
    // @ts-ignore
    const data = action.data || {};
    const { deleteCode } = data;
    // @ts-ignore
    const newSelectedFilters = getState().List.selectedFilters.bitsFilter;
    // @ts-ignore
    const newSelectedLabels = getState().List.selectedFilters.filterLabels || [];
    const deleteLabel = newSelectedLabels.find(label => label && label.code === deleteCode);

    _.pull(newSelectedFilters, deleteCode);
    _.pull(newSelectedLabels, deleteLabel);

    dispatch(updateSelectedFilter({ bitsFilter: newSelectedFilters, filterLabels: newSelectedLabels }));
    done();
  },
});

export default [
  apiListBatchQuery,
  apiListQueryProducts,
  apiListQueryProductsCallback,
  setGroupIdByIndex,
  deleteSelectedFilter,
];
