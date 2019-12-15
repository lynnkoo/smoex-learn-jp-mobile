import React from 'react';
import {
  Platform, StatusBar, View, StyleSheet,
} from 'react-native';
import { ViewPort, IBasePageProps } from '@ctrip/crn';
import BbkSkeletonLoading, { PageType } from '@ctrip/bbk-component-skeleton-loading';
import BbkFilterBar from '@ctrip/bbk-component-car-filter-bar';
import { BbkStyleUtil } from '@ctrip/bbk-utils';
import BbkSearchPanelModal from '@ctrip/bbk-component-search-panel-modal';
import CPage, { IStateType } from '../../Components/App/CPage';
import { PageId } from '../../Constants/Index';
import { ListPropsModel, ListServiceModel } from '../../Global/Business/Index';
import FilterAndSortModal from './Components/FilterAndSortModal';

// 组件
import ListHeader from '../../Containers/ListHeaderContainer';
import VehGroupNav from '../../Containers/ListVehGroupContainer';
// import VehicleListWithControl from './Components/VehicleListWithControl';

interface ListStateType extends IStateType {
  locationDatePopVisible: boolean;
  filterAndSortModalVisible: boolean;
}

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

interface IListPropsType extends IBasePageProps {
  isLoading: boolean;
  isFail: boolean;
  setPageStatus: (data: any) => void;
  fetchList: () => void;
}

export default class List extends CPage<IListPropsType, ListStateType> {
  batchesRequest: any[];

  constructor(props) {
    super(props);
    this.state = {
      locationDatePopVisible: false, // 修改取还车信息弹层是否展示
      filterAndSortModalVisible: false, // 筛选和排序弹层是否展示
    };
    this.batchesRequest = []; // 记录当前页面响应回来的请求次数, resCode: 201/200, result: 1成功，-1失败
  }

  getPageId() {
    super.getPageId();
    return PageId.List.ID;
  }

  componentDidMount() {
    super.componentDidMount();
    this.props.fetchList();
    // test 为了模拟200和201间隔回来
    setTimeout(() => {
      this.props.fetchList();
    }, 10000);
  }

  // 调用获取列表页数据接口
  fetchListProduct = () => {
    this.batchesRequest = [];
    ListServiceModel.apiListBatchQuery(this.apiListQueryProductsCallback);
  }

  apiListQueryProductsCallback = (data) => {
    this.props.setPageStatus({ batchesRequest: this.batchesRequest, ...data });
  }

  getCurStage() {
    let curStage;
    const { isFail, isLoading } = this.props;
    if (isFail) {
      curStage = PAGESTAGE.FAIL;
    } else if (!isLoading) {
      curStage = PAGESTAGE.SHOW;
    } else {
      curStage = PAGESTAGE.INIT;
    }
    return curStage;
  }

  // 处理热门筛选项的点击事件
  handlePopularFilterPress = () => {
    this.controlFilterModalIsShow();
  }

  // 控制筛选和排序弹层是否展示
  controlFilterModalIsShow = () => {
    const { filterAndSortModalVisible } = this.state;
    this.setState({
      filterAndSortModalVisible: !filterAndSortModalVisible,
    });
  }

  // 控制取还车信息弹层是否展示
  controlRentalLocationDatePopIsShow = (isFlag = false) => {
    const { locationDatePopVisible } = this.state;
    // todo
    // if (progress !== 1) {
    //   Toast.show('加载中，请稍候...');
    //   return;
    // }

    if (locationDatePopVisible !== isFlag) {
      this.setState({
        locationDatePopVisible: isFlag,
      });
    }
  };

  render() {
    const curStage = this.getCurStage();
    console.log('render++++curStage', curStage);
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
        <ListHeader
          onPressCurrency={() => { }}
          showSearchSelectorWrap={() => { this.controlRentalLocationDatePopIsShow(true); }}
          style={BbkStyleUtil.getMB(4)}
        />
        <BbkFilterBar {...ListPropsModel.getFilterBarProps(this.handlePopularFilterPress)} />
        <VehGroupNav pageId={this.getPageId()} />

        {curStage === PAGESTAGE.INIT
          && (
            <View style={{ overflow: 'hidden' }}>
              <BbkSkeletonLoading visible pageName={PageType.List} />
            </View>
          )
        }
        {/** 无结果 */}
        {curStage === PAGESTAGE.SHOW
          && (
            <View>
              {/** 供应商报价 */}
              {/* <VehicleListWithControl /> */}
            </View>
          )
        }

        <BbkSearchPanelModal
          visible={this.state.locationDatePopVisible}
          onCancel={this.controlRentalLocationDatePopIsShow}
          {...ListPropsModel.getSearchPanelProps()}
        />

        <FilterAndSortModal
          visible={this.state.filterAndSortModalVisible}
          {...ListPropsModel.getFilterAndSortModalProps()}
          onHide={this.controlFilterModalIsShow}
        />
      </ViewPort>
    );
  }
}
