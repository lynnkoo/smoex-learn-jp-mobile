import React from 'react';
import {
  Platform, StatusBar, View, StyleSheet,
} from 'react-native';
import { ViewPort, IBasePageProps } from '@ctrip/crn';
import BbkSkeletonLoading, { PageType } from '@ctrip/bbk-component-skeleton-loading';
import BbkFilterBar from '@ctrip/bbk-component-car-filter-bar';
import BbkComponentCarHeader from '@ctrip/bbk-component-car-header';
import CPage, { IStateType } from '../../Components/App/CPage';
import VehGroupNav from './Components/VehGroupNav';
import { PageId } from '../../Constants/Index';
import ListReqAndResData from '../../Global/Cache/ListReqAndResData';
import { ListPropsModel, ListServiceModel } from '../../Global/Business/Index';


interface ListStateType extends IStateType {
  isLoading: boolean;
  isFail: boolean;
  progress: number;
  activeGroupId: string;
}

const HCODE = {
  C200: '200',
  C201: '201',
};

const REQUEST_COUNT = 2;

const PAGESTAGE = {
  INIT: '初始加载',
  SHOW: '有响应数据',
  FAIL: '无响应数据',
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
});

export default class List extends CPage<IBasePageProps, ListStateType> {
  batchesRequest: any[];

  resData: any;

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isFail: false,
      progress: 0,
      activeGroupId: '',
    };
    this.batchesRequest = []; // 记录当前页面响应回来的请求次数, resCode: 201/200, result: 1成功，-1失败
  }

  getPageId() {
    super.getPageId();
    return PageId.List.ID;
  }

  componentDidMount() {
    this.fetchListProduct();
  }

  // 调用获取列表页数据接口
  fetchListProduct = () => {
    this.batchesRequest = [];
    ListServiceModel.apiListBatchQuery(this.apiListQueryProductsCallback);
  }

  apiListQueryProductsCallback = (data) => {
    const { isSuccess, res } = data;
    const resCode = res && res.baseResponse && res.baseResponse.code;
    if (resCode === HCODE.C200 || resCode === HCODE.C201) {
      ListReqAndResData.setData(ListReqAndResData.keyList.listProductRes, res);
    }
    const curPageStatus = this.calculatePageStatus(isSuccess, resCode);
    const { isLoading, isFail, progress } = curPageStatus;
    this.setState({
      isLoading,
      isFail,
      progress,
    });
  }

  // 计算当前页面的状态, 包含：是否展示loading, 页面是否有结果, 进度条的状态
  calculatePageStatus = (isSuccess, resCode) => {
    const { isLoading, isFail, progress } = this.state;
    // 记录当前响应的结果
    const curRequest = this.batchesRequest.find(f => f.resCode === resCode);
    if (!curRequest) {
      this.batchesRequest.push({ resCode, result: isSuccess ? 1 : -1 });
    }

    let nextFailed = isFail;
    let nextIsLoading = isLoading;
    let nextProgress = progress;
    // 计算当前响应的总次数
    let successCount = 0;
    let failCount = 0;
    let curProgress = 0;
    this.batchesRequest.forEach((m) => {
      if (m.result === 1) successCount += 1;
      if (m.result === -1) failCount += 1;
    });
    const totalCount = successCount + failCount;

    // 计算进度条的进度值
    if (totalCount >= REQUEST_COUNT) {
      curProgress = 1;
    } else if (totalCount > 0) {
      curProgress = 0.3;
    } else {
      curProgress = 0;
    }

    const has200 = this.batchesRequest.find(f => f.resCode === HCODE.C200);
    // 当前有数据展示，则不展示loading
    const curPageResData = ListReqAndResData.getData(ListReqAndResData.keyList.listProductRes);
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
  }

  getCurStage() {
    let curStage;
    const { isFail, isLoading } = this.state;
    if (isFail) {
      curStage = PAGESTAGE.FAIL;
    } else if (!isLoading) {
      curStage = PAGESTAGE.SHOW;
    } else {
      curStage = PAGESTAGE.INIT; // loading ...
    }
    return curStage;
  }


  render() {
    const curStage = this.getCurStage();
    return (
      <ViewPort style={styles.page}>
        {Platform.OS === 'android' && (
          <StatusBar
            backgroundColor="transparent"
            barStyle="dark-content"
            hidden={false}
            translucent
          />
        )}
        {curStage === PAGESTAGE.INIT && <BbkSkeletonLoading visible pageName={PageType.List} />}
        {/** 加载条 */}
        {/** 无结果 */}

        {curStage === PAGESTAGE.SHOW
          && (
            <View>
              {/** 头部 */}
              <BbkComponentCarHeader
                {...ListPropsModel.getListHeaderProps()}
                onPressCurrency={() => { }}
                showSearchSelectorWrap={() => { }}
              />
              {/** 热门排序 */}
              <BbkFilterBar {...ListPropsModel.getFilterBarProps()} />
              {/** 车型组 */}
              <VehGroupNav {...ListPropsModel.getVehNavProps(this.getPageId())} />
            </View>
          )
        }

        {/** 快速筛选 */}

        {/** tip */}
        {/** 供应商报价 */}
      </ViewPort>
    );
  }
}
