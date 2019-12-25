import React, { RefObject } from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import {
  ViewPort, IBasePageProps, Event, Toast,
} from '@ctrip/crn';
import BbkSkeletonLoading, { PageType } from '@ctrip/bbk-component-skeleton-loading';
import { BbkUtils } from '@ctrip/bbk-utils';
import { color } from '@ctrip/bbk-tokens';
import CPage, { IStateType } from '../../Components/App/CPage';
import { AssistiveTouch } from '../../Components/Index';
import { PageId, ClickKey } from '../../Constants/Index';
import { CarLog } from '../../Util/Index';

// 组件
import ListHeader from '../../Containers/ListHeaderContainer';
import VehGroupNav from '../../Containers/ListVehGroupContainer';
import FilterAndSortModal from '../../Containers/ListFilterAndSortModalContainer';
import ListFilterBar from '../../Containers/ListFilterBarContainer';
import VehicleListWithControl from '../../Containers/VehicleListWithControlContainer';
import SearchPanelModal from '../../Containers/SearchPanelModalContainer';
import ListNoMatch from '../../Containers/NoMatchContainer';
import RentalCarsDatePicker from '../../Containers/DatePickerContainer';
import { ListReqAndResData } from '../../Global/Cache/Index';

const { selector } = BbkUtils;

interface ListStateType extends IStateType {
  filterAndSortModalVisible: boolean;
  listThreshold: number,
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
    zIndex: 1,
  },
  shadowStyle: {
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 4,
    shadowColor: color.modalShadow,
    shadowOpacity: 1,
    elevation: 4,
  },
  headerStyle: {
    elevation: 0,
    borderBottomWidth: 0,
    marginBottom: BbkUtils.getPixel(4),
  },
  filterBarStyle: {
    elevation: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.grayBorder,
  },
});

interface IListPropsType extends IBasePageProps {
  isLoading: boolean;
  isFail: boolean;
  rentalDate: any;
  datePickerVisible: boolean;
  locationDatePopVisible: boolean;
  progress: number;
  fetchList: () => void;
  setLocationInfo: (rentalLocation: any) => void;
  setActiveFilterBarCode: (data: any) => void;
  setDatePickerIsShow: ({ visible: boolean }) => void;
  setLocationAndDatePopIsShow: ({ visible: boolean }) => void;
  isDebugMode?: boolean;
}

const removeEvents = () => {
  Event.removeEventListener('changeRentalLocation');
};

export default class List extends CPage<IListPropsType, ListStateType> {
  batchesRequest: any[];

  filterModalRef: RefObject<any>;

  datePickerRef: any;

  hasInitFetch: boolean;

  constructor(props) {
    super(props);
    this.state = {
      filterAndSortModalVisible: false, // 筛选和排序弹层是否展示
      listThreshold: 0,
    };
    this.batchesRequest = []; // 记录当前页面响应回来的请求次数, resCode: 201/200, result: 1成功，-1失败
    ListReqAndResData.removeData();
    this.hasInitFetch = false;
    this.filterModalRef = React.createRef();
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
    CarLog.LogCode({ enName: ClickKey.C_LIST_BACK.KEY });
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

  onPressFilterBar = (type, isActive) => {
    this.props.setActiveFilterBarCode({ activeFilterBarCode: selector(!isActive, type, '') });
    if (!isActive) {
      this.filterModalRef.current.show();
    } else {
      this.filterModalRef.current.hide();
    }
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

  handlePressHeader = () => {
    if (this.props.progress !== 1) {
      Toast.show('加载中，请稍候...'); // todo shark key
      return;
    }
    this.props.setLocationAndDatePopIsShow({ visible: true });
    CarLog.LogCode({ enName: ClickKey.C_LIST_HEADER_CHANGEINFO.KEY });
  }

  render() {
    const { listThreshold } = this.state;
    const curStage = this.getCurStage();
    console.log('render++++curStage', curStage);
    return (
      <ViewPort style={styles.page}>
        <View style={[styles.wrapper, styles.shadowStyle]} onLayout={this.setVehicleListThreshold}>
          <ListHeader
            handleBackPress={this.pageGoBack}
            showSearchSelectorWrap={this.handlePressHeader}
            style={styles.headerStyle}
          />
          {/** todo FilterBar 展开动画 */}
          <ListFilterBar onPressFilterBar={this.onPressFilterBar} style={styles.filterBarStyle} />
          <VehGroupNav pageId={this.getPageId()} />
        </View>
        {curStage === PAGESTAGE.INIT && <BbkSkeletonLoading visible pageName={PageType.List} />
        }
        {
          curStage === PAGESTAGE.FAIL
          && <ListNoMatch datePickerRef={this.datePickerRef} />
        }
        {/** 供应商报价 */}
        {curStage === PAGESTAGE.SHOW
          && (
            <VehicleListWithControl
              threshold={listThreshold}
            />
          )
        }
        <SearchPanelModal />
        <FilterAndSortModal filterModalRef={this.filterModalRef} />
        <RentalCarsDatePicker handleDatePickerRef={this.handleDatePickerRef} />
        {
          this.props.isDebugMode
          && <AssistiveTouch onPress={() => { this.push('Debug'); }} />
        }
      </ViewPort>
    );
  }
}
