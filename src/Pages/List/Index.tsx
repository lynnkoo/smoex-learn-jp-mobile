import React from 'react';
import {
  View, StyleSheet, Animated,
} from 'react-native';
import {
  ViewPort, IBasePageProps, Event,
} from '@ctrip/crn';
import _ from 'lodash';
import BbkSkeletonLoading, { PageType } from '@ctrip/bbk-component-skeleton-loading';
import { BbkUtils, BbkConstants } from '@ctrip/bbk-utils';
import { color, druation, setOpacity } from '@ctrip/bbk-tokens';
import CPage, { IStateType } from '../../Components/App/CPage';
import { AssistiveTouch } from '../../Components/Index';
import { PageId, ClickKey, EventName } from '../../Constants/Index';
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
import { getExposureData, removeExposureData } from '../../Global/Cache/ListReqAndResData';

const { DEFAULT_HEADER_HEIGHT } = BbkConstants;
interface HeaderAnim {
  translateY: any,
  opacity: any,
}

interface ListStateType extends IStateType {
  listThreshold: number,
  headerAnim: HeaderAnim,
}

const PAGESTAGE = {
  INIT: 'INIT',
  SHOW: 'SHOW',
  FAIL: 'FAIL',
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
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowColor: setOpacity(color.black, 0.08),
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
  indexCallbckData: any;
  datePickerVisible: boolean;
  locationDatePopVisible: boolean;
  agePickerVisible: boolean;
  ageTipPopVisible: boolean;
  filterBarIsShow: boolean;
  fetchList: () => void;
  setLocationInfo: (rentalLocation: any) => void;
  setDatePickerIsShow: ({ visible: boolean }) => void;
  setLocationAndDatePopIsShow: ({ visible: boolean }) => void;
  setAgePickerIsShow: ({ visible: boolean }) => void;
  setAgeTipPopIsShow: ({ visible: boolean }) => void;
  setFilterModalIsShow: ({ visible: boolean }) => void;
  isDebugMode?: boolean;
}

const removeEvents = () => {
  Event.removeEventListener(EventName.changeRentalLocation);
};

export default class List extends CPage<IListPropsType, ListStateType> {
  datePickerRef: any;

  hasInitFetch: boolean;

  headerAnimating: boolean;

  lastTranslateYAnim: number;

  listThresholdLayout: number;

  scrollHeaderThrottle: any;

  vehicleListRef: any;

  constructor(props) {
    super(props);
    this.state = {
      listThreshold: 0,
      headerAnim: {
        translateY: new Animated.Value(0),
        opacity: new Animated.Value(1),
      },
    };
    ListReqAndResData.removeData();
    this.headerAnimating = false;
    this.lastTranslateYAnim = 0;
    this.listThresholdLayout = 0;
    this.setScrollHeaderThrottle();
  }

  /* eslint-disable class-methods-use-this */
  getPageId() {
    return PageId.List.ID;
  }

  componentDidMount() {
    super.componentDidMount();
    this.props.fetchList();
    this.registerEvents();
    removeExposureData();
  }

  componentWillUnmount() {
    removeEvents();
    this.sendEvents();
  }

  pageWillDisappear() {
    this.logExposureData();
  }

  registerEvents() {
    Event.addEventListener(EventName.changeRentalLocation, (data) => {
      this.props.setLocationInfo({
        ...data,
        fromEvent: 'changeRentalLocation',
      });
    });
  }

  sendEvents() {
    Event.sendEvent(EventName.changeRentalDate, this.props.indexCallbckData);
  }

  logExposureData() {
    const data = getExposureData();
    CarLog.LogTrace({
      key: '123546',
      info: data,
    });
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

  setVehicleListThreshold = ({ nativeEvent }) => {
    const { listThreshold } = this.state;
    const { height } = nativeEvent.layout;
    if (listThreshold !== height && this.props.filterBarIsShow) {
      this.listThresholdLayout = height;
      this.setState({
        listThreshold: height,
      });
    }
  }

  handleDatePickerRef = (ref) => {
    this.datePickerRef = ref;
  }

  onBackAndroid() {
    const {
      datePickerVisible, locationDatePopVisible, agePickerVisible, ageTipPopVisible,
    } = this.props;
    if (datePickerVisible) {
      this.datePickerRef.dismiss(() => {
        this.props.setDatePickerIsShow({ visible: false });
      });
    } else if (locationDatePopVisible) {
      this.props.setLocationAndDatePopIsShow({ visible: false });
    } else if (agePickerVisible) {
      this.props.setAgePickerIsShow({ visible: false });
    } else if (ageTipPopVisible) {
      this.props.setAgeTipPopIsShow({ visible: false });
    } else {
      this.pageGoBack();
    }
  }

  handlePressHeader = () => {
    this.props.setFilterModalIsShow({ visible: false });
    this.props.setLocationAndDatePopIsShow({ visible: true });
    CarLog.LogCode({ enName: ClickKey.C_LIST_HEADER_CHANGEINFO.KEY });
  }

  scrollUpCallback = () => {
    this.scrollHeaderThrottle(-DEFAULT_HEADER_HEIGHT);
  }

  scrollDownCallback = (event) => {
    const { y } = event.nativeEvent.contentOffset;
    if (y < 50) {
      this.scrollHeaderThrottle.cancel();
      this.scrollHeaderThrottle(0, 0);
    } else {
      this.scrollHeaderThrottle(0);
    }
  }

  setScrollHeaderThrottle = () => {
    this.scrollHeaderThrottle = _.throttle(
      this.scrollHeaderAnimation,
      druation.animationDurationSm,
      {
        trailing: false,
      });
  }

  scrollHeaderAnimation = (value, duration = druation.animationDurationSm) => {
    const { headerAnim } = this.state;
    const { translateY, opacity } = headerAnim;
    if (this.lastTranslateYAnim === value || this.headerAnimating || !this.props.filterBarIsShow) {
      return;
    }
    this.lastTranslateYAnim = value;
    this.setState({
      listThreshold: this.listThresholdLayout + value,
    }, () => {
      Animated.parallel([
        Animated.timing(translateY,
          {
            toValue: value,
            duration,
            useNativeDriver: true,
          },
        ),
        Animated.timing(opacity, {
          toValue: value < 0 ? 0 : 1,
          duration,
          useNativeDriver: true,
        }),
        this.vehicleListRef.resetTranslateY(0),
      ]).start(() => {
        this.headerAnimating = false;
      });
    });
  }

  render() {
    const { listThreshold, headerAnim } = this.state;
    const { translateY, opacity } = headerAnim;
    const curStage = this.getCurStage();
    return (
      <ViewPort style={styles.page}>
        <Animated.View
          style={{
            flex: 1,
            transform: [{
              translateY,
            }],
          }}
        >
          <View
            style={[styles.wrapper, styles.shadowStyle]}
            onLayout={this.setVehicleListThreshold}
          >
            <Animated.View
              style={{
                opacity,
              }}
            >
              <ListHeader
                handleBackPress={this.pageGoBack}
                showSearchSelectorWrap={this.handlePressHeader}
                style={styles.headerStyle}
              />
            </Animated.View>
            {curStage === PAGESTAGE.SHOW && (
              <ListFilterBar style={styles.filterBarStyle} />
            )}
            <VehGroupNav pageId={this.getPageId()} />
          </View>

          {curStage === PAGESTAGE.INIT && <BbkSkeletonLoading visible pageName={PageType.List} />}
          {
            curStage === PAGESTAGE.FAIL
            && <ListNoMatch datePickerRef={this.datePickerRef} />
          }

          {/** 供应商报价 */}
          {curStage === PAGESTAGE.SHOW
            && (
              <VehicleListWithControl
                threshold={listThreshold}
                scrollUpCallback={this.scrollUpCallback}
                scrollDownCallback={this.scrollDownCallback}
                refFn={(ref) => { this.vehicleListRef = ref; }}
              />
            )
          }
        </Animated.View>
        <SearchPanelModal />
        <FilterAndSortModal
          enableNavigatorDragBack={CPage.enableNativeDragBack}
          disableNavigatorDragBack={CPage.disableNativeDragBack}
          style={{ marginTop: listThreshold - BbkUtils.getPixel(84) }}
        />
        <RentalCarsDatePicker handleDatePickerRef={this.handleDatePickerRef} />
        {
          this.props.isDebugMode
          && <AssistiveTouch onPress={() => { this.push('Debug'); }} />
        }
      </ViewPort>
    );
  }
}
