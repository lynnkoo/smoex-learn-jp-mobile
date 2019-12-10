import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, Animated, Dimensions,
} from 'react-native';
import { Toast } from '@ctrip/crn';
import BbkThemeProvider from '@ctrip/bbk-theming';
import TripLight from '@ctrip/bbk-theming/src/themes/Theming.trip.light';
import TripDark from '@ctrip/bbk-theming/src/themes/Theming.trip.dark';
import { color } from '@ctrip/bbk-tokens';
import { themeLight, themeDark } from './Theme';
import { listData } from './mock';
import VehicleList from '../../Components/List/VehicleList';

const { height } = Dimensions.get('window');
const scrollViewHeight = height - 40;

const getSections = index => listData.map(item => ({
  ...item,
  vehicleHeader: {
    ...item.vehicleHeader,
    vehicleName: `scroll ${index} : ${item.vehicleHeader.vehicleName}`,
  },
}));

const maxIndex = 5;
const minIndex = 1;
const initIndex = 3;

const allData = {};
for (let i = minIndex; i <= maxIndex - minIndex + 1; i += 1) {
  allData[i] = getSections(i);
}

interface VehicleListDemoState {
  index: number;
  initIndex: number;
  isDark: boolean;
  translateYAnim: any;
}

export default class VehicleListDemo extends Component<any, VehicleListDemoState> {
  cacheList = [];

  cacheData = allData;

  scrollerRef = {};

  isScrolling = false;

  constructor(props) {
    super(props);
    this.state = {
      index: initIndex,
      initIndex,
      isDark: false,
      translateYAnim: new Animated.Value(0),
    };
  }

  getButtons(theme) {
    return new Array(maxIndex).fill(1).map((item, index) => (
      /* eslint-disable-next-line */
      <TouchableOpacity style={{ width: 70, alignItems: 'center' }} onPress={() => this.tabScroll(index + 1)} key={index}>
        <Text style={{ color: theme.black, lineHeight: 40 }}>{index + 1}</Text>
      </TouchableOpacity>
    ));
  }

  onRefreshSection = (callback) => {
    if (this.isScrolling) {
      return Toast.show('正在加载');
    }

    console.log('---------onRefreshSection');
    const { index } = this.state;

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
    const { translateYAnim, initIndex: initIdx } = this.state;
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

  renderVehicleListDom = (index, style, reset) => {
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

    // console.log('-----------')

    const cache = this.cacheList[index];
    if (!cache) {
      this.cacheList[index] = (
        <VehicleList
          stickySectionHeadersEnabled
          refFn={(ref) => {
            this.scrollerRef[index] = ref;
          }}
          style={style}
          key={index}
          index={index}
          sections={this.cacheData[index]}

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
      initIndex: index,
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

  renderAllVehicleListDom($index) {
    const dom = [];
    const reset = $index !== undefined;
    const index = $index || this.state.index;
    for (let i = minIndex; i <= maxIndex - minIndex + 1; i += 1) {
      const offset = i - index;
      const style = {
        position: 'absolute',
        top: scrollViewHeight * offset,
        height: scrollViewHeight,
        width: '100%',
      };
      dom[i] = this.renderVehicleListDom(i, style, reset);
    }

    return dom;
  }

  render() {
    const {
      isDark, translateYAnim,
    } = this.state;
    const theme = isDark ? {
      ...TripDark,
      ...themeDark,
    } : {
      ...TripLight,
      ...themeLight,
    };

    return (
      <>
        <BbkThemeProvider theme={theme} channel={null}>
          <View style={
            {
              flex: 1,
              backgroundColor: theme.scrollBackgroundColor,
            }
          }
          >
            <View style={
              {
                flexDirection: 'row',
                position: 'absolute',
                top: 0,
                width: '100%',
                zIndex: 10,
                height: 40,
                justifyContent: 'center',
                alignContent: 'center',
                backgroundColor: color.greenBg,
              }
            }
            >
              {this.getButtons(theme)}
            </View>
            <Animated.View style={{
              marginTop: 40,
              transform: [{
                translateY: translateYAnim,
              }],
              flex: 1,
            }}
            >
              {this.renderAllVehicleListDom(undefined)}
            </Animated.View>
          </View>
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
