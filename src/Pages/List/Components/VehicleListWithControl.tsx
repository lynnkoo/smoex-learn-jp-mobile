import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, Animated, Dimensions,
} from 'react-native';
import { Toast } from '@ctrip/crn';
import BbkThemeProvider from '@ctrip/bbk-theming';
import TripLight from '@ctrip/bbk-theming/src/themes/Theming.trip.light';
import TripDark from '@ctrip/bbk-theming/src/themes/Theming.trip.dark';
import { color } from '@ctrip/bbk-tokens';
import { themeLight, themeDark } from '../Theme';
import VehicleList from './VehicleList';

interface VehicleListWithControlProps {
  maxIndex?: number;
  minIndex?: number;
  initIndex: number;
  listData?: any;
  initialNumToRender?: number;
  theme?: any;
  height?: number;
  threshold?: number;
  showMax?: number;
  locationDatePopVisible: boolean
}

interface VehicleListWithControlState {
  index: number;
  isDark: boolean;
  translateYAnim: any;
}

export default class VehicleListWithControl extends Component<VehicleListWithControlProps, VehicleListWithControlState> {
  static defaultProps = {
    maxIndex: 0,
    minIndex: 0,
    initIndex: 0,
    listData: {},
    initialNumToRender: 10,
    theme: {},
    height: Dimensions.get('window').height,
    threshold: 0,
    showMax: 2,
  };

  cacheList = [];

  scrollerRef = {};

  isScrolling = false;

  cachePlaceHolder = null;

  constructor(props) {
    super(props);
    const { initIndex } = props;
    this.state = {
      index: initIndex,
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

    console.log('---------onRefreshSection');
    const { index } = this.state;
    const { minIndex } = this.props;

    if (index <= 1) {
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

  animate = (index, callback = () => {}) => {
    const { translateYAnim } = this.state;
    const { height, threshold, initIndex: initIdx } = this.props;
    const scrollViewHeight = height - threshold;
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
    this.scrollerRef[index].scrollToLocation({ sectionIndex: 0, itemIndex: 0, animated: false });
  }

  onLoadMore = (callback) => {
    const { index } = this.state;
    const { maxIndex } = this.props;
    if (this.isScrolling) {
      return Toast.show('正在加载');
    }

    console.log('---------onLoadMore');
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

  // eslint-disable-next-line
  renderVehicleListDom = (index, style, reset, placeHolder) => {
    const {
      listData, minIndex, maxIndex, initialNumToRender, theme, showMax,
    } = this.props;
    if (index < minIndex || index > maxIndex) {
      return null;
    }

    const isTop = index === minIndex;
    const noRefresh = isTop && '到顶了～';
    const refreshTip = isTop ? '' : `查看${index - 1}经济车型`;
    const loadTip = `查看${index + 1}经济车型`;
    const pullIcon = !isTop ? '\ue0b5' : ' ';
    const noticeContent = `上拉${loadTip}`;
    const loadingContent = `松开${loadTip}`;
    const pullStartContent = noRefresh || `下拉${refreshTip}`;
    const pullContinueContent = noRefresh || `松开${refreshTip}`;
    const noMore = index >= maxIndex;

    const cache = this.cacheList[index];
    if (!cache) {
      if (placeHolder) {
        return <View style={style} key={index} />;
      }
      this.cacheList[index] = (
        <VehicleList
          stickySectionHeadersEnabled
          refFn={(ref) => {
            this.scrollerRef[index] = ref;
          }}
          style={style}
          key={index}
          index={index}
          sections={listData[index]}
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
          noMoreContent="到底了～"

          initialNumToRender={initialNumToRender}
          endFillColor={theme.scrollBackgroundColor || color.grayBg}
        />
      );
    } else if (reset) {
      this.scrollerRef[index].setNativeProps({
        style,
      });
    }

    return this.cacheList[index];
  }

  tabScroll = (index) => {
    const { translateYAnim } = this.state;
    this.setState({
      index,
    });
    Animated.timing(
      translateYAnim,
      {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      },
    ).start();
    this.renderAllVehicleListDom(index);
  }

  // eslint-disable-next-line
  UNSAFE_componentWillReceiveProps(props) {
    if (props.initIndex !== this.props.initIndex) {
      this.tabScroll(props.initIndex);
    }
  }

  renderAllVehicleListDom($index) {
    const dom = [];
    const reset = $index !== undefined;
    const index = $index || this.state.index;
    const {
      minIndex, maxIndex, threshold, height,
    } = this.props;
    const scrollViewHeight = height - threshold;
    const theme = this.getTheme();

    for (let i = minIndex; i <= maxIndex - minIndex + 1; i += 1) {
      const offset = i - index;
      const style = {
        position: 'absolute',
        top: scrollViewHeight * offset,
        height: scrollViewHeight,
        width: '100%',
        backgroundColor: theme.scrollBackgroundColor,
      };
      const placeHolder = Math.abs(offset) > 1;
      dom[i] = this.renderVehicleListDom(i, style, reset, placeHolder);
    }

    return dom;
  }

  render() {
    const {
      isDark, translateYAnim,
    } = this.state;
    const { threshold, height } = this.props;
    const theme = this.getTheme();

    return (
      <>
        <BbkThemeProvider theme={theme} channel={null}>
          <Animated.View style={{
            position: 'absolute',
            top: threshold,
            height: height - threshold,
            width: '100%',
            transform: [{
              translateY: translateYAnim,
            }],
            flex: 1,
            overFlow: 'hidden',
          }}
          >
            {this.renderAllVehicleListDom(undefined)}
          </Animated.View>
        </BbkThemeProvider>
        <TouchableOpacity
          onPress={() => {
            this.setState({ isDark: !isDark });
          }}
          style={{
            position: 'absolute',
            right: 30,
            bottom: 30,
            zIndex: 999,
            padding: 10,
            borderRadius: 4,
            borderColor: theme.backgroundColor,
            borderWidth: 1,
            backgroundColor: theme.bbkTextColor,
          }}
        >
          <Text
            style={{
              color: theme.backgroundColor,
            }}
          >
            Theme
          </Text>
        </TouchableOpacity>
      </>
    );
  }
}
