import React, { PureComponent } from 'react';
import {
  View, Animated, StyleSheet,
} from 'react-native';
import _ from 'lodash';
import { Toast } from '@ctrip/crn';
import BbkThemeProvider from '@ctrip/bbk-theming';
import TripLight from '@ctrip/bbk-theming/src/themes/Theming.trip.light';
import TripDark from '@ctrip/bbk-theming/src/themes/Theming.trip.dark';
import { getSharkValue } from '@ctrip/bbk-shark';
import { color } from '@ctrip/bbk-tokens';
import { themeLight, themeDark } from '../Theme';
import { listLoading } from '../Texts';
import VehicleList from './VehicleList';
import { getGroupNameByIndex } from '../../../State/List/VehicleListMappers';
import { Utils } from '../../../Util/Index';

interface VehicleListWithControlProps {
  maxIndex?: number;
  minIndex?: number;
  index: number;
  progress?: number;
  listData?: any;
  lastNextIndexObj?: any;
  initialNumToRender?: number;
  theme?: any;
  height?: number;
  threshold?: number;
  showMax?: number;
  locationDatePopVisible: boolean;
  setActiveGroupId: (args: any) => void;
}

interface VehicleListWithControlState {
  index: number;
  initIndex: number;
  isDark: boolean;
  translateYAnim: any;
}

const styles = StyleSheet.create({
  absoluteWrap: {
    position: 'absolute',
    width: '100%',
  },
  wrap: {
    flex: 1,
    overflow: 'hidden',
  },
});

export default class VehicleListWithControl extends
  PureComponent<VehicleListWithControlProps, VehicleListWithControlState> {
  static defaultProps = {
    maxIndex: 0,
    minIndex: 0,
    index: 0,
    listData: {},
    initialNumToRender: 10,
    theme: {},
    height: Utils.heightWithStatusBar,
    threshold: 0,
    showMax: 2,
    lastNextIndexObj: {},
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
      isDark: false,
      translateYAnim: new Animated.Value(0),
    };
  }

  getTheme() {
    const {
      isDark,
    } = this.state;

    return isDark
      ? {
        ...TripDark,
        ...themeDark,
      } : {
        ...TripLight,
        ...themeLight,
      };
  }

  getStyle(i) {
    const { initIndex } = this.state;
    const {
      threshold, height,
    } = this.props;
    const theme = this.getTheme();
    const scrollViewHeight = height - threshold;
    const offset = i - initIndex;
    // console.log('【performance】getStyle ', i, initIndex)
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

    this.isScrolling = true;
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

    this.isScrolling = true;
    this.setState({
      index: newIndex,
    });
    this.animate(newIndex, callback);
    return null;
  }

  animate = (index, callback = () => { }) => {
    const { translateYAnim, initIndex: initIdx } = this.state;
    const { height, threshold, setActiveGroupId } = this.props;
    const scrollViewHeight = height - threshold;
    // console.log('【performance】animate ', initIdx, index)
    Animated.timing(
      translateYAnim,
      {
        toValue: scrollViewHeight * (initIdx - index),
        duration: 500,
        useNativeDriver: true,
      },
    ).start(() => {
      this.isScrolling = false;
      callback();
    });
    if (this.scrollerRef[index]) {
      // fix no match
      try {
        this.scrollerRef[index].scrollToLocation(
          { sectionIndex: 0, itemIndex: 0, animated: false });
      } catch (e) {
        /* eslint-disable no-console */
        console.warn('scrollToLocation error');
      }
    }
    setActiveGroupId({ activeGroupIndex: index });
    this.animating = true;
  }

  getVehicleListProps = (index, newLastNextIndexObj) => {
    const {
      minIndex, maxIndex, lastNextIndexObj,
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
      pullIcon,
      pullStartContent,
      pullContinueContent,
      refreshingIcon: pullIcon,
      refreshingContent: pullContinueContent,
      noMore,
      noticeContent,
      loadingContent,
      noMoreContent,
    };
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
      minIndex, maxIndex, initialNumToRender, theme, showMax,
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
      // console.log('【performance】cache ', index, placeHolder)
      this.cacheList[index] = (
        <VehicleList
          stickySectionHeadersEnabled
          refFn={(ref) => {
            this.scrollerRef[index] = ref;
          }}
          style={style}
          key={index}
          index={index}
          sections={listData[index] || []}
          showMax={showMax}
          onRefresh={this.onRefreshSection}
          onLoadMore={this.onLoadMore}
          initialNumToRender={initialNumToRender}
          endFillColor={theme.scrollBackgroundColor || color.grayBg}
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
    const { translateYAnim, initIndex } = this.state;
    const { height, threshold } = this.props;
    const scrollViewHeight = height - threshold;
    // console.log('【performance】tabScroll ', initIndex, nextIndex)
    Animated.timing(
      translateYAnim,
      {
        toValue: scrollViewHeight * (initIndex - nextIndex),
        duration: 0,
        useNativeDriver: true,
      },
    ).start();
    this.setState({
      index: nextIndex,
    });
  }

  // eslint-disable-next-line
  UNSAFE_componentWillReceiveProps(props) {
    const { index, listData } = this.props;
    if (props.index !== index) {
      this.tabScroll(props.index);
    }
    if (!_.isEqual(props.listData, listData)) {
      this.renderAllVehicleListDom(props.listData, props.lastNextIndexObj);
    }
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
      threshold, height, maxIndex, minIndex,
    } = this.props;
    const theme = this.getTheme();
    const scrollViewHeight = height - threshold;

    return (
      <BbkThemeProvider theme={theme} channel={null}>
        <View style={styles.wrap}>
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
      </BbkThemeProvider>
    );
  }
}
