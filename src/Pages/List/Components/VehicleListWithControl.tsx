import React, { PureComponent } from 'react';
import {
  View, Animated, StyleSheet,
} from 'react-native';
import _ from 'lodash';
import { Toast } from '@ctrip/crn';
import { getSharkValue } from '@ctrip/bbk-shark';
import { color, druation as druationToken } from '@ctrip/bbk-tokens';
import { listLoading } from '../Texts';
import VehicleList, { VehicleListProps } from './VehicleList';
import { getGroupNameByIndex } from '../../../State/List/VehicleListMappers';
import { setExposureKey } from '../../../Global/Cache/ListReqAndResData';

interface VehicleListWithControlProps extends VehicleListProps {
  maxIndex?: number;
  minIndex?: number;
  index: number;
  progress?: number;
  listData?: any;
  lastNextIndexObj?: any;
  initialNumToRender?: number;
  theme?: any;
  scrollViewHeight?: number;
  locationDatePopVisible: boolean;
  setActiveGroupId: (args: any) => void;
  refFn?: (args: any) => void;
}

interface VehicleListWithControlState {
  index: number;
  initIndex: number;
  translateYAnim: any;
}

const styles = StyleSheet.create({
  absoluteWrap: {
    position: 'absolute',
    width: '100%',
  },
  wrap: {
    overflow: 'hidden',
  },
});

const getLogKey = (vendor) => {
  const {
    vehicleIndex,
    vendorIndex,
    vehicleCode,
    reference = {},
  } = vendor;
  const {
    bizVendorCode,
  } = reference;
  return {
    vehicleIndex,
    vendorIndex,
    vehicleCode,
    bizVendorCode,
  };
};

export default class VehicleListWithControl extends
  PureComponent<VehicleListWithControlProps, VehicleListWithControlState> {
  static defaultProps = {
    maxIndex: 0,
    minIndex: 0,
    index: 0,
    listData: {},
    initialNumToRender: 10,
    theme: {
      scrollBackgroundColor: color.grayBg,
    },
    showMax: 2,
    lastNextIndexObj: {},
    scrollViewHeight: 0,
  };

  cacheList = [];

  cacheStyle = [];

  scrollerRef = {};

  isScrolling = false;

  cachePlaceHolder = null;

  animating = false;

  constructor(props) {
    super(props);
    const { index } = props;
    this.state = {
      initIndex: index,
      index,
      translateYAnim: new Animated.Value(0),
    };
    props.refFn(this);
  }

  getStyle(i, newScrollViewHeight?: number) {
    let { scrollViewHeight } = this.props;
    const { theme } = this.props;
    scrollViewHeight = newScrollViewHeight || scrollViewHeight;
    const { initIndex } = this.state;
    const offset = i - initIndex;
    // console.log('【performance】getStyle ', i, initIndex)
    // console.log('----------getStyle', i, scrollViewHeight, offset)
    return [styles.absoluteWrap, {
      top: scrollViewHeight * offset,
      height: scrollViewHeight,
      backgroundColor: theme.scrollBackgroundColor,
    }];
  }

  onRefreshSection = (callback) => {
    if (this.isScrolling) {
      return Toast.show(listLoading);
    }

    // console.log('---------onRefreshSection');
    const { index } = this.state;
    const { minIndex, lastNextIndexObj } = this.props;

    const newIndex = lastNextIndexObj[index].last;
    if (index < minIndex || newIndex < minIndex) {
      return null;
    }

    this.setState({
      index: newIndex,
    });

    this.animate(newIndex, callback);
    return null;
  }

  onLoadMore = (callback) => {
    const { index } = this.state;
    const { maxIndex, lastNextIndexObj } = this.props;
    if (this.isScrolling) {
      return Toast.show(listLoading);
    }

    // console.log('---------onLoadMore');
    const newIndex = lastNextIndexObj[index].next;
    if (index > maxIndex || newIndex > maxIndex) {
      return null;
    }

    this.setState({
      index: newIndex,
    });
    this.animate(newIndex, callback);
    return null;
  }

  animate = (index, callback = () => { }) => {
    const { setActiveGroupId } = this.props;
    // console.log('【performance】animate ', initIdx, index)
    this.isScrolling = true;
    this.translateY({
      index,
      duration: druationToken.animationDurationBase,
      callback: () => {
        this.isScrolling = false;
        callback();
      },
    });
    if (this.scrollerRef[index]) {
      this.scrollToTop(index);
    }
    setActiveGroupId({ activeGroupIndex: index });
    this.animating = true;
  }

  getVehicleListProps = (index, newLastNextIndexObj) => {
    const {
      minIndex,
      maxIndex,
      lastNextIndexObj,
      initialNumToRender,
      theme,
      showMax,
      scrollUpCallback,
      scrollDownCallback,
      scrollViewHeight,
    } = this.props;

    const $lastNextIndexObj = newLastNextIndexObj || lastNextIndexObj;
    const { last, next } = $lastNextIndexObj[index];
    const isTop = index <= minIndex || last < minIndex;
    const noRefresh = isTop && getSharkValue('listCombine_toTheTop');
    const noMoreContent = getSharkValue('listCombine_toTheBottom');
    const lastGroupName = getGroupNameByIndex(last);
    const nextGroupName = getGroupNameByIndex(next);
    const pullIcon = !isTop ? '\ue0b5' : ' ';
    const noticeContent = getSharkValue('listCombine_pullUpToRefersh', nextGroupName);
    const loadingContent = getSharkValue('listCombine_releaseToRefersh', nextGroupName);
    const pullStartContent = noRefresh
      || getSharkValue('listCombine_pulDownToRefersh', lastGroupName);
    const pullContinueContent = noRefresh
      || getSharkValue('listCombine_releaseToRefersh', lastGroupName);
    // console.log('noMore ', index, next, maxIndex, $lastNextIndexObj)
    const noMore = index >= maxIndex || next > maxIndex;

    return {
      index,
      key: index,
      stickySectionHeadersEnabled: true,
      showMax,
      initialNumToRender,
      endFillColor: theme.scrollBackgroundColor,
      /**
       * scroll handler props
       */
      onRefresh: this.onRefreshSection,
      onLoadMore: this.onLoadMore,
      refFn: (ref) => {
        this.scrollerRef[index] = ref;
      },
      scrollUpCallback,
      scrollDownCallback,
      /**
       * refresh control props
       */
      pullIcon,
      pullStartContent,
      pullContinueContent,
      refreshingIcon: pullIcon,
      refreshingContent: pullContinueContent,
      /**
       * load control props
       */
      noMore,
      noticeContent,
      loadingContent,
      noMoreContent,
      /**
       * 曝光埋点
       */
      onViewableItemsChanged: this.setExposureData,
      scrollViewHeight,
    };
  }

  setExposureData = ({ changed }) => {
    _.forEach(changed, ({ item }) => {
      try {
        if (item.data) {
          _.forEach(item.data[0], (vendor) => {
            const key = getLogKey(vendor);
            setExposureKey(key);
          });
        } else {
          const key = getLogKey(item[0]);
          setExposureKey(key);
        }
      } catch (e) {
        // eslint-disable-next-line
        console.warn('setExposureData error', item.data, item);
      }
    });
  }

  /**
   * listData, newLastNextIndexObj is for render data use new props
   * cause VehicleList will only recieve the first load of props
   * @param {number} index              渲染车型组 index
   * @param {boolean} placeHolder       是否占位，懒渲染
   * @param {any} listData              最新的 listData props
   * @param {any} newLastNextIndexObj   用于筛选后的可用车型组索引
   * @returns {any}                     渲染的 VehicleList dom
   */
  renderVehicleListDom = (index, placeHolder, listData, newLastNextIndexObj) => {
    const {
      minIndex, maxIndex,
    } = this.props;
    if (index < minIndex || index > maxIndex) {
      return null;
    }

    const cache = this.cacheList[index];
    if (!cache) {
      const style = this.getStyle(index);
      if (placeHolder) {
        return <View style={style} key={index} />;
      }
      // @ts-ignore
      // logTime('【performance】 cache render');
      this.cacheList[index] = (
        <VehicleList
          style={style}
          sections={listData[index] || []}
          {...this.getVehicleListProps(index, newLastNextIndexObj)}
        />
      );
    }

    return this.cacheList[index];
  }

  tabScroll = (nextIndex) => {
    if (this.animating) {
      this.animating = false;
      return;
    }
    // console.log('【performance】tabScroll ', initIndex, nextIndex)
    this.translateY({
      index: nextIndex,
      duration: 0,
    });
    this.setState({
      index: nextIndex,
    });
  }

  scrollToTop(index) {
    // fix no match
    try {
      this.scrollerRef[index].scrollToLocation({
        sectionIndex: 0,
        itemIndex: 0,
        animated: false,
        // fix ListHeaderExtraComponent offset 一个足够大的值
        viewOffset: 1000,
      });
    } catch (e) {
      /* eslint-disable no-console */
      console.warn('scrollToLocation error', index, e);
    }
  }

  // eslint-disable-next-line
  UNSAFE_componentWillReceiveProps(props) {
    const { index, listData, scrollViewHeight } = this.props;
    if (props.index !== index) {
      this.tabScroll(props.index);
    }
    if (!_.isEqual(props.listData, listData)) {
      this.renderAllVehicleListDom(props.listData, props.lastNextIndexObj);
      this.resetScrollTop();
    }
    if (!_.isEqual(props.scrollViewHeight, scrollViewHeight)) {
      this.resetHeightStyle(props.scrollViewHeight);
    }
  }

  resetScrollTop() {
    _.forEach(this.scrollerRef, (ref, index) => {
      this.scrollToTop(index);
    });
  }

  resetTranslateY(duration) {
    const { index } = this.state;
    return this.translateY({
      index,
      duration,
      delayStart: true,
    });
  }

  translateY({
    index,
    duration = druationToken.animationDurationBase,
    callback = () => {},
    delayStart = false,
  }) {
    const { translateYAnim, initIndex } = this.state;
    const { scrollViewHeight } = this.props;
    // console.log('translateY', this.scrollViewHeight);
    const animation = Animated.timing(
      translateYAnim,
      {
        toValue: scrollViewHeight * (initIndex - index),
        duration,
        useNativeDriver: true,
      },
    );
    if (delayStart) {
      return animation;
    }
    return animation.start(callback);
  }

  // 滑动头部隐藏时需要更新 VehicleList 高度及定位
  resetHeightStyle(scrollViewHeight) {
    this.cacheList.forEach((dom, index) => {
      this.scrollerRef[index].setNativeProps({
        style: this.getStyle(index, scrollViewHeight),
      });
    });
  }

  renderAllVehicleListDom(newListData?: any, lastNextIndexObj?: any) {
    const dom = [];
    const { index } = this.state;
    const {
      minIndex, maxIndex, listData,
    } = this.props;

    const $listData = newListData || listData;

    if (newListData) {
      this.cacheList = [];
    }

    // console.log('【performance】renderAllVehicleListDom ')
    for (let i = minIndex; i <= maxIndex - minIndex + 1; i += 1) {
      const placeHolder = Math.abs(i - index) > 0;
      dom[i] = this.renderVehicleListDom(i, placeHolder, $listData, lastNextIndexObj);
    }

    return dom;
  }

  render() {
    const {
      translateYAnim,
    } = this.state;
    const {
      maxIndex, minIndex, scrollViewHeight,
    } = this.props;

    return (
      <View style={[styles.wrap, {
        // 手动设置隐藏头时的高度
        height: scrollViewHeight,
      }]}
      >
        <Animated.View style={[styles.absoluteWrap, {
          top: 0,
          height: (maxIndex - minIndex + 1) * scrollViewHeight,
          transform: [{
            translateY: translateYAnim,
          }],
        }]}
        >
          {this.renderAllVehicleListDom()}
        </Animated.View>
      </View>
    );
  }
}
