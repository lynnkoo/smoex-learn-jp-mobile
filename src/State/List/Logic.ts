import { createLogic } from 'redux-logic';
import { GET_STATUS } from './Types';
import { ApiResCode } from '../../Constants/Index';
import { ListReqAndResData, ListResSelectors } from '../../Global/Cache/Index';
import { setStatus, initActiveGroupId } from './Actions';


const calculatePageStatus = (data) => {
  const {
    isSuccess, resCode, batchesRequest, isLoading, isFail, progress,
  } = data;
  // 记录当前响应的结果
  const curRequest = batchesRequest.find(f => f.resCode === resCode);
  if (!curRequest) {
    batchesRequest.push({ resCode, result: isSuccess ? 1 : -1 });
  }

  let nextFailed = isFail;
  let nextIsLoading = isLoading;
  let nextProgress = progress;
  // 计算当前响应的总次数
  let successCount = 0;
  let failCount = 0;
  let curProgress = 0;
  batchesRequest.forEach((m) => {
    if (m.result === 1) successCount += 1;
    if (m.result === -1) failCount += 1;
  });
  const totalCount = successCount + failCount;

  // 计算进度条的进度值
  if (totalCount >= 2) {
    curProgress = 1;
  } else if (totalCount > 0) {
    curProgress = 0.3;
  } else {
    curProgress = 0;
  }

  const has200 = batchesRequest.find(f => f.resCode === ApiResCode.ListResCode.C200);
  // 当前有数据展示，则不展示loading
  const curPageResData = ListResSelectors.getBaseResData();
  if (curPageResData && curPageResData.productList && curPageResData.productList.length > 0) {
    nextIsLoading = false;
    nextFailed = false;
    nextProgress = curProgress;
  } else if (has200) { // 200且当前页面没有数据展示
    nextIsLoading = false;
    nextFailed = true;
    nextProgress = 1;
  } else {
    nextIsLoading = curProgress === 0; // todo 待确认, 如果是第一批失败的话, 会展示白屏
    nextFailed = curProgress === 1;
    nextProgress = curProgress;
  }

  return {
    isLoading: nextIsLoading,
    isFail: nextFailed,
    progress: nextProgress,
  };
};

export const setPageStatus = createLogic({
  type: GET_STATUS,
  /* eslint-disable no-empty-pattern */
  async process({ action, getState }, dispatch, done) {
    // @ts-ignore
    const {
      isSuccess, resCode, res, batchesRequest,
      // @ts-ignore
    } = action.data;
    if (isSuccess && (resCode === ApiResCode.ListResCode.C200 || resCode === ApiResCode.ListResCode.C201)) {
      ListReqAndResData.setData(ListReqAndResData.keyList.listProductRes, res);
      const initGId = res.productGroups[0].groupCode;
      dispatch(initActiveGroupId({ activeGroupId: initGId }));
    }
    // @ts-ignore
    const { isLoading, isFail, progress } = getState().List;
    const param = {
      isSuccess,
      resCode,
      batchesRequest,
      isLoading,
      isFail,
      progress,
    };
    const curPageStatus = calculatePageStatus(param);
    dispatch(setStatus({ ...curPageStatus }));

    done();
  },
});

export default [
  setPageStatus,
];
