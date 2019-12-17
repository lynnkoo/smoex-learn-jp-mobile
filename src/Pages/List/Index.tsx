import React from 'react';
import {
  Platform, StatusBar, View, StyleSheet,
} from 'react-native';
import { ViewPort, IBasePageProps, Event } from '@ctrip/crn';
import BbkSkeletonLoading, { PageType } from '@ctrip/bbk-component-skeleton-loading';
import BbkFilterBar from '@ctrip/bbk-component-car-filter-bar';
import { BbkStyleUtil } from '@ctrip/bbk-utils';
import { color } from '@ctrip/bbk-tokens';
import CPage, { IStateType } from '../../Components/App/CPage';
import { PageId } from '../../Constants/Index';
import { ListPropsModel, ListServiceModel } from '../../Global/Business/Index';
import FilterAndSortModal from './Components/FilterAndSortModal';

// 组件
import ListHeader from '../../Containers/ListHeaderContainer';
import VehGroupNav from '../../Containers/ListVehGroupContainer';
import VehicleListWithControl from '../../Containers/VehicleListWithControlContainer';
import SearchPanelModal from '../../Containers/SearchPanelModalContainer';
import ListNoMatch from '../../Containers/NoMatchContainer';
import RentalCarsDatePicker from '../../Containers/DatePickerContainer';

interface ListStateType extends IStateType {
  filterAndSortModalVisible: boolean;
  listThreshold: number
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
  wrapper: {
    backgroundColor: color.white,
  },
});

interface IListPropsType extends IBasePageProps {
  isLoading: boolean;
  isFail: boolean;
  rentalDate: any;
  datePickerVisible: boolean;
  locationDatePopVisible: boolean;
  setPageStatus: (data: any) => void;
  fetchList: () => void;
  fetchApiListCallback: (data: any) => void;
  setLocationInfo: (rentalLocation: any) => void;
  setDatePickerIsShow: ({ visible: boolean }) => void;
  setLocationAndDatePopIsShow: ({ visible: boolean }) => void;
}

const removeEvents = () => {
  Event.removeEventListener('changeRentalLocation');
};

export default class List extends CPage<IListPropsType, ListStateType> {
  batchesRequest: any[];

  datePickerRef: any;

  constructor(props) {
    super(props);
    this.state = {
      filterAndSortModalVisible: false, // 筛选和排序弹层是否展示
      listThreshold: 0,
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
    this.registerEvents();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    removeEvents();
    this.sendEvents();
  }

  registerEvents() {
    Event.addEventListener('changeRentalLocation', (data) => {
      this.props.setLocationInfo({
        ...data,
        fromEvent: 'changeRentalLocation',
      });
    });
  }

  sendEvents() {
    Event.sendEvent('changeRentalDate', this.props.rentalDate);
  }

  pageGoBack = () => {
    this.pop();
    // todo log
  }

  // 调用获取列表页数据接口
  fetchListProduct = () => {
    this.batchesRequest = [];
    ListServiceModel.apiListBatchQuery(this.apiListQueryProductsCallback);
  }

  apiListQueryProductsCallback = (data) => {
    this.props.setPageStatus({ batchesRequest: this.batchesRequest, ...data });
    this.props.fetchApiListCallback({ batchesRequest: this.batchesRequest, ...data });
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

  setVehicleListThreshold = ({ nativeEvent }) => {
    const { height } = nativeEvent.layout;
    this.setState({
      listThreshold: height,
    });
  }

  handleDatePickerRef = (ref) => {
    this.datePickerRef = ref;
  }

  onBackAndroid() {
    const { datePickerVisible, locationDatePopVisible } = this.props;
    if (datePickerVisible) {
      this.datePickerRef.dismiss(() => {
        this.props.setDatePickerIsShow({ visible: false });
      });
    } else if (locationDatePopVisible) {
      this.props.setLocationAndDatePopIsShow({ visible: false });
    } else {
      this.pageGoBack();
    }
  }

  render() {
    const { listThreshold } = this.state;
    const curStage = this.getCurStage();
    console.log('render++++curStage', curStage);
    return (
      <ViewPort style={styles.page}>
        <View style={styles.wrapper} onLayout={this.setVehicleListThreshold}>
          {Platform.OS === 'android' && (
            <StatusBar
              backgroundColor="transparent"
              barStyle="dark-content"
              hidden={false}
              translucent
            />
          )}
          <ListHeader
            handleBackPress={this.pageGoBack}
            onPressCurrency={() => { }}
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
          {
            curStage === PAGESTAGE.FAIL
            && <ListNoMatch datePickerRef={this.datePickerRef} />
          }
        </View>

        {/** 供应商报价 */}
        {curStage === PAGESTAGE.SHOW
          && (
            <VehicleListWithControl
              threshold={listThreshold}
            />
          )
        }

        <SearchPanelModal />

        <FilterAndSortModal
          visible={this.state.filterAndSortModalVisible}
          {...ListPropsModel.getFilterAndSortModalProps()}
          onHide={this.controlFilterModalIsShow}
        />

        <RentalCarsDatePicker handleDatePickerRef={this.handleDatePickerRef} />

      </ViewPort>
    );
  }
}
