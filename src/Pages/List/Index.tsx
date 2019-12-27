import React, { RefObject } from 'react';
import {
  View, StyleSheet, Animated,
} from 'react-native';
import {
  ViewPort, IBasePageProps, Event, Toast,
} from '@ctrip/crn';
import BbkSkeletonLoading, { PageType } from '@ctrip/bbk-component-skeleton-loading';
import { BbkUtils, BbkConstants } from '@ctrip/bbk-utils';
import { color, druation } from '@ctrip/bbk-tokens';
import CPage, { IStateType } from '../../Components/App/CPage';
import { AssistiveTouch } from '../../Components/Index';
import { PageId, ClickKey, EventName } from '../../Constants/Index';
import { CarLog } from '../../Util/Index';
import { listLoading } from './Texts';

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
  indexCallbckData: any;
  datePickerVisible: boolean;
  locationDatePopVisible: boolean;
  agePickerVisible: boolean;
  ageTipPopVisible: boolean;
  progress: number;
  fetchList: () => void;
  setLocationInfo: (rentalLocation: any) => void;
  setDatePickerIsShow: ({ visible: boolean }) => void;
  setLocationAndDatePopIsShow: ({ visible: boolean }) => void;
  setAgePickerIsShow: ({ visible: boolean }) => void;
  setAgeTipPopIsShow: ({ visible: boolean }) => void;
  isDebugMode?: boolean;
}

const removeEvents = () => {
  Event.removeEventListener(EventName.changeRentalLocation);
};

export default class List extends CPage<IListPropsType, ListStateType> {
  filterModalRef: RefObject<any>;

  datePickerRef: any;

  hasInitFetch: boolean;

  headerAnimating: boolean;

  lastTranslateYAnim: number;

  listThresholdLayout: number;

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
    this.filterModalRef = React.createRef();
    this.headerAnimating = false;
    this.lastTranslateYAnim = 0;
    this.listThresholdLayout = 0;
  }

  /* eslint-disable class-methods-use-this */
  getPageId() {
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
    if (listThreshold !== height) {
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

  // todo 移至到header内单独处理
  handlePressHeader = () => {
    if (this.props.progress !== 1) {
      Toast.show(listLoading);
      return;
    }
    this.filterModalRef.current.hide();
    this.props.setLocationAndDatePopIsShow({ visible: true });
    CarLog.LogCode({ enName: ClickKey.C_LIST_HEADER_CHANGEINFO.KEY });
  }

  scrollUpCallback = () => {
    this.scrollHeaderAnimation(-DEFAULT_HEADER_HEIGHT);
  }

  scrollDownCallback = () => {
    this.scrollHeaderAnimation(0);
  }

  scrollHeaderAnimation = (value) => {
    const { headerAnim } = this.state;
    const { translateY, opacity } = headerAnim;
    if (this.lastTranslateYAnim === value || this.headerAnimating) {
      return;
    }
    this.lastTranslateYAnim = value;
    Animated.sequence([
      Animated.parallel([
        Animated.timing(translateY,
          {
            toValue: value,
            duration: druation.animationDurationSm,
            useNativeDriver: true,
          },
        ),
        Animated.timing(opacity, {
          toValue: value < 0 ? 0 : 1,
          duration: druation.animationDurationSm,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      this.headerAnimating = false;
      this.setState({
        listThreshold: this.listThresholdLayout + value,
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
            {/** todo FilterBar 展开动画 */}
            <ListFilterBar
              filterModalRef={this.filterModalRef}
              style={styles.filterBarStyle}
            />
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
              />
            )
          }
        </Animated.View>
        <SearchPanelModal />
        <FilterAndSortModal
          filterModalRef={this.filterModalRef}
          // @ts-ignore
          navigation={this.props.navigation}
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
