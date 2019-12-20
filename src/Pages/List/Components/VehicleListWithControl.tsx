import React, { PureComponent } from 'react';
import {
  View, Animated, Dimensions, StyleSheet,
} from 'react-native';
import { Toast } from '@ctrip/crn';
import BbkThemeProvider from '@ctrip/bbk-theming';
import TripLight from '@ctrip/bbk-theming/src/themes/Theming.trip.light';
import TripDark from '@ctrip/bbk-theming/src/themes/Theming.trip.dark';
import { getSharkValue } from '@ctrip/bbk-shark';
import { color } from '@ctrip/bbk-tokens';
import { themeLight, themeDark } from '../Theme';
import VehicleList from './VehicleList';
import { getGroupNameByIndex } from '../../../State/List/VehicleListMappers';

interface VehicleListWithControlProps {
  maxIndex?: number;
  minIndex?: number;
  index: number;
  progress?: number;
  listData?: any;
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
});

export default class VehicleListWithControl extends PureComponent<VehicleListWithControlProps, VehicleListWithControlState> {
  static defaultProps = {
    maxIndex: 0,
    minIndex: 0,
    index: 0,
    listData: {},
    initialNumToRender: 10,
    theme: {},
    height: Dimensions.get('window').height,
    threshold: 0,
    showMax: 2,
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

    return isDark ? {
      ...TripDark,
      ...themeDark,
    } : {
      ...TripLight,
      ...themeLight,
    };
  }

  onRefreshSection = (callback) => {
    if (this.isScrolling) {
      return Toast.show('正在加载');
    }

    // console.log('---------onRefreshSection');
    const { index } = this.state;
    const { minIndex } = this.props;

    if (index <= minIndex) {
      return null;
    }

    this.isScrolling = true;
    const newIndex = Math.max(index - 1, minIndex);
    this.setState({
      index: newIndex,
    });

    this.animate(newIndex, callback);
    return null;
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

  animate = (index, callback = () => {}) => {
    const { translateYAnim, initIndex: initIdx } = this.state;
    const { height, threshold } = this.props;
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
      this.scrollerRef[index].scrollToLocation({ sectionIndex: 0, itemIndex: 0, animated: false });
    }
    this.props.setActiveGroupId({ activeGroupIndex: index });
    this.animating = true;
  }

  onLoadMore = (callback) => {
    const { index } = this.state;
    const { maxIndex } = this.props;
    if (this.isScrolling) {
      return Toast.show('正在加载');
    }

    // console.log('---------onLoadMore');
    if (index >= maxIndex) {
      return null;
    }

    this.isScrolling = true;
    const newIndex = Math.min(index + 1, maxIndex);
    this.setState({
      index: newIndex,
    });
    this.animate(newIndex, callback);
    return null;
  }

  renderVehicleListDom = (index, placeHolder) => {
    const {
      listData, minIndex, maxIndex, initialNumToRender, theme, showMax,
    } = this.props;
    if (index < minIndex || index > maxIndex) {
      return null;
    }

    const isTop = index === minIndex;
    const noRefresh = isTop && getSharkValue('listCombine_toTheTop');
    const noMoreContent = getSharkValue('listCombine_toTheBottom');
    const lastGroupName = getGroupNameByIndex(index - 1);
    const nextGroupName = getGroupNameByIndex(index + 1);
    const pullIcon = !isTop ? '\ue0b5' : ' ';
    const noticeContent = getSharkValue('listCombine_pullUpToRefersh', nextGroupName);
    const loadingContent = getSharkValue('listCombine_releaseToRefersh', nextGroupName);
    const pullStartContent = noRefresh || getSharkValue('listCombine_pulDownToRefersh', lastGroupName);
    const pullContinueContent = noRefresh || getSharkValue('listCombine_releaseToRefersh', lastGroupName);
    const noMore = index >= maxIndex;

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
          pullIcon={pullIcon}
          pullStartContent={pullStartContent}
          pullContinueContent={pullContinueContent}
          refreshingIcon={pullIcon}
          refreshingContent={pullContinueContent}

          onLoadMore={this.onLoadMore}
          noMore={noMore}
          noticeContent={noticeContent}
          loadingContent={loadingContent}
          noMoreContent={noMoreContent}

          initialNumToRender={initialNumToRender}
          endFillColor={theme.scrollBackgroundColor || color.grayBg}
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
    if (props.index !== this.props.index) {
      this.tabScroll(props.index);
    }
  }

  renderAllVehicleListDom() {
    const dom = [];
    const { index } = this.state;
    const {
      minIndex, maxIndex,
    } = this.props;

    // console.log('【performance】renderAllVehicleListDom ', $index, reset)
    for (let i = minIndex; i <= maxIndex - minIndex + 1; i += 1) {
      const placeHolder = Math.abs(i - index) > 0;
      dom[i] = this.renderVehicleListDom(i, placeHolder);
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
        <View style={[styles.absoluteWrap, {
          top: threshold,
          height: scrollViewHeight,
          overflow: 'hidden',
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
      </BbkThemeProvider>
    );
  }
}
