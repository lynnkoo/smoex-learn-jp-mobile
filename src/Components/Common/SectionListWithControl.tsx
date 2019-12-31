import React, { Component, ReactElement } from 'react';
import {
  SectionList, SectionListProps, StyleSheet, View, ScrollResponderEvent,
} from 'react-native';
import _ from 'lodash';
import { RefreshControl, LoadControl } from '@ctrip/crn';
import { color } from '@ctrip/bbk-tokens';
import { BbkUtils } from '@ctrip/bbk-utils';

const { isIos, lazySelector } = BbkUtils;

// @ts-ignore
export interface SectionListWithControlProps extends SectionListProps<any> {
  sections: [];
  threshold?: number;
  throttle?: number;
  pullStartContent?: string;
  pullContinueContent?: string;
  refreshingIcon?: string;
  refreshingContent?: string;
  refreshResult?: boolean;
  noMore?: boolean;
  noMoreContent?: string;
  noticeContent?: string;
  onRefresh?: (cb: Function) => void;
  onLoadMore?: (cb: Function) => void;
  index?: number;
  refFn?: (cb: Function) => void;
  pullIcon?: string;
  loadingContent?: string;
  ListHeaderExtraComponent?: ReactElement;
  ListFooterExtraComponent?: ReactElement;
  ListEmptyComponent?: ReactElement;
  scrollUpCallback?: (e: ScrollResponderEvent) => void;
  scrollDownCallback?: (e: ScrollResponderEvent) => void;
  shouldSetMinHeight?: boolean;
}

interface SectionListWithControlState {
  refreshing: boolean;
  onLoading: boolean;
  refreshResult: boolean;
  showAndroidLoad: boolean;
  showAndroidRefresh: boolean;
  showFooter?: boolean;
}

const styles = StyleSheet.create({
  controlWrap: {
    position: 'absolute',
    // refreshControl 的默认高度
    top: -35,
    width: '100%',
  },
  androidRefreshWrap: {
    position: 'absolute',
    width: '100%',
    zIndex: -1,
  },
  iconStyle: {
    color: color.blueBase,
  },
  textStyle: {
    color: color.fontPrimary,
  },
});

export default class SectionListWithControl
  extends Component<SectionListWithControlProps, SectionListWithControlState> {
  refreshControl = null;

  loadControl = null;

  refreshControlWrap = null;

  loadControlWrap = null;

  scroller = null;

  lastScrollY = 0;

  onScrollBegin = false;

  // eslint-disable-next-line
  onScrollThrottle: any;

  static defaultProps = {
    throttle: 50,
  };

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      onLoading: false,
      refreshResult: null,
      showAndroidLoad: false,
      showAndroidRefresh: false,
      showFooter: false,
    };
    this.setScrollThrottle();
  }

  setScrollThrottle = () => {
    const { throttle } = this.props;
    this.onScrollThrottle = isIos ? this.onScroll : _.throttle(this.onScroll, throttle, {
      trailing: false,
    });
  }

  // eslint-disable-next-line
  triggerScroll = (event, triggerEvent = 'onScroll') => {
    const { threshold } = this.props;
    let { showAndroidLoad, showAndroidRefresh } = this.state;
    const { y } = event.nativeEvent.contentOffset;
    const { height } = event.nativeEvent.layoutMeasurement;
    const contentHeight = event.nativeEvent.contentSize.height;
    let load = false;
    let refresh = false;
    const scrollUp = y - this.lastScrollY;

    // console.log(triggerEvent, y, this.lastScrollY, scrollUp, this.onScrollBegin)

    /**
     * 列表页打通，下拉上一个，上滑下一个
     */
    if (isIos) {
      // 不满一屏的情况
      if (scrollUp > threshold && y + height > contentHeight + threshold) {
        load = true;
      }
      if (scrollUp < threshold && y < -threshold) {
        refresh = true;
      }
    } else {
      const nextShowAndroidLoad = y + height > contentHeight - threshold;
      if (nextShowAndroidLoad && showAndroidLoad) {
        load = true;
      }
      showAndroidLoad = nextShowAndroidLoad;

      const nextShowAndroidRefresh = y < threshold;
      if (nextShowAndroidRefresh && showAndroidRefresh) {
        refresh = true;
      }
      showAndroidRefresh = nextShowAndroidRefresh;
    }

    this.scrollUpDown(triggerEvent, scrollUp, y, event);

    if (triggerEvent === 'onScrollBeginDrag') {
      this.lastScrollY = y;
    }

    return {
      load,
      refresh,
      showAndroidLoad,
      showAndroidRefresh,
    };
  }

  scrollUpDown = (triggerEvent, scrollUp, y, event) => {
    const { scrollUpCallback, scrollDownCallback, shouldSetMinHeight } = this.props;

    if (shouldSetMinHeight) {
      return;
    }

    /**
     * 头部隐藏/显示
     */
    let triggerScrollUpCallback = false;
    let triggerScrollDownCallback = false;
    if (this.onScrollBegin && triggerEvent === 'onScroll') {
      if (scrollUp > 0) {
        triggerScrollUpCallback = true;
      } else if (scrollUp < 0) {
        triggerScrollDownCallback = true;
      }
    }

    // 安卓顶部不会触发 onScroll的情况
    if (
      !isIos
      && this.onScrollBegin
      && triggerEvent === 'onScrollEndDrag'
      && y === 0
      && scrollUp === 0
    ) {
      triggerScrollDownCallback = true;
    }

    if (triggerScrollUpCallback && scrollUpCallback) {
      scrollUpCallback(event);
    } else if (triggerScrollDownCallback && scrollDownCallback) {
      scrollDownCallback(event);
    }
  }

  onScroll = (event) => {
    const { onLoading, refreshing } = this.state;
    if (onLoading || refreshing) {
      return;
    }

    const {
      load,
      refresh,
    } = this.triggerScroll(event);

    // onScrollEndDrag could be triggered before onScroll finished
    this.setState({
      onLoading: this.onScrollBegin && load,
      refreshing: this.onScrollBegin && refresh,
    });
  }

  onScrollBeginDrag = (event) => {
    this.onScrollBegin = true;
    const {
      showAndroidLoad,
      showAndroidRefresh,
    } = this.triggerScroll(event, 'onScrollBeginDrag');

    if (isIos) {
      return;
    }

    const { throttle } = this.props;

    if (showAndroidRefresh && this.refreshControlWrap) {
      this.refreshControlWrap.setNativeProps({
        style: {
          paddingTop: throttle,
        },
      });
    }

    if (showAndroidLoad && this.loadControlWrap) {
      this.loadControlWrap.setNativeProps({
        style: {
          paddingBottom: throttle,
        },
      });
    }
  }

  recoverMoveLength = () => {
    if (isIos) {
      return;
    }

    if (this.refreshControlWrap) {
      this.refreshControlWrap.setNativeProps({
        style: {
          paddingTop: 0,
        },
      });
    }

    if (this.loadControlWrap) {
      this.loadControlWrap.setNativeProps({
        style: {
          paddingBottom: 0,
        },
      });
    }
  }

  onScrollEndDrag = (event) => {
    this.recoverMoveLength();

    const {
      load,
      refresh,
      showAndroidLoad,
      showAndroidRefresh,
    } = this.triggerScroll(event, 'onScrollEndDrag');

    this.onScrollBegin = false;

    const nextState: any = {
      showAndroidLoad,
      showAndroidRefresh,
    };

    if (load) {
      const { onLoadMore } = this.props;
      const { showFooter } = this.state;
      if (!showFooter) {
        return;
      }
      onLoadMore(() => {
        this.setState({
          onLoading: false,
        });
      });
    } else {
      nextState.onLoading = false;
    }

    if (refresh) {
      const { onRefresh } = this.props;
      onRefresh(() => {
        this.setState({
          refreshing: false,
        });
      });
    } else {
      nextState.refreshing = false;
    }

    this.setState(nextState);
  }

  // to fix control state
  // onScrollEndDrag could be triggered before onScroll finished
  onMomentumScrollEnd = () => {
    this.setState({
      onLoading: false,
      refreshing: false,
    });
  }

  refFn = (ref) => {
    const { refFn: propsRefFn } = this.props;
    if (propsRefFn) {
      propsRefFn(ref);
    }
    this.scroller = ref;
  }

  onViewableItemsChanged = (args) => {
    const { viewableItems } = args;
    const { sections, onViewableItemsChanged } = this.props;
    if (viewableItems.length > 0) {
      try {
        const last = _.last(viewableItems).section;
        if (last.vehicleIndex === sections.length - 1) {
          this.setState({
            // showFooter: isIos ? true : (sections.length > 1 || last.data.length > 1),
            showFooter: true,
          });
        } else {
          this.setState({
            showFooter: false,
          });
        }
        if (onViewableItemsChanged) {
          onViewableItemsChanged(args);
        }
      } catch (e) {
        // eslint-disable-next-line
        console.warn('onViewableItemsChanged error', e);
      }
    }
  }

  render() {
    const {
      refreshing,
      onLoading,
      refreshResult,
      showFooter,
    } = this.state;
    const {
      throttle,
      sections,
      renderItem,
      renderSectionHeader,
      renderSectionFooter,
      index,
      style,

      pullStartContent,
      pullIcon,
      pullContinueContent,
      refreshingIcon,
      refreshingContent,

      noMore,
      noticeContent,
      loadingContent,
      noMoreContent,

      initialNumToRender,
      endFillColor,
      ListHeaderExtraComponent,
      ListFooterExtraComponent,
      ListEmptyComponent,
    } = this.props;

    const refreshControl = (
      // ts-ignore
      <RefreshControl
        style={isIos ? styles.controlWrap : [styles.androidRefreshWrap, {
          top: throttle - 35,
        }]}
        iconStyle={styles.iconStyle}
        textStyle={styles.textStyle}
        // @ts-ignore
        ref={ref => { this.refreshControl = ref }} // eslint-disable-line
        // @ts-ignore
        isRefreshing={refreshing}
        refreshResult={refreshResult}
        pullIcon={pullIcon}
        pullStartContent={pullStartContent}
        pullContinueContent={pullContinueContent}
        refreshingIcon={refreshingIcon}
        refreshingContent={refreshingContent}
      />
    );

    const listHeaderComponent = (
      <View ref={(ref) => { this.refreshControlWrap = ref; }}>
        {ListHeaderExtraComponent}
        {refreshControl}
      </View>
    );

    const loadControl = (
      <LoadControl
        style={styles.controlWrap}
        iconStyle={styles.iconStyle}
        textStyle={styles.textStyle}
        // eslint-disable-next-line
        ref={ref => { this.loadControl = ref }}
        isLoading={onLoading}
        noMore={noMore}
        noMoreContent={noMoreContent}
        noticeContent={noticeContent}
        loadingContent={loadingContent}
      />
    );

    const listFooterComponent = lazySelector(
      showFooter,
      () => (
        <View ref={(ref) => { this.loadControlWrap = ref; }}>
          {ListFooterExtraComponent}
          {loadControl}
        </View>
      )
      ,
    );

    return (
      <SectionList
        style={style}
        ref={this.refFn}
        initialNumToRender={initialNumToRender}
        endFillColor={endFillColor}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        renderSectionFooter={renderSectionFooter}
        sections={sections}
        keyExtractor={() => `${index}`}
        scrollEventThrottle={throttle}
        onScrollBeginDrag={this.onScrollBeginDrag}
        onScrollEndDrag={this.onScrollEndDrag}
        onScroll={this.onScrollThrottle}
        onMomentumScrollEnd={isIos && this.onMomentumScrollEnd}
        ListHeaderComponent={listHeaderComponent}
        ListFooterComponent={listFooterComponent}
        ListEmptyComponent={ListEmptyComponent}
        onViewableItemsChanged={this.onViewableItemsChanged}
        // https://github.com/facebook/react-native/blob/master/Libraries/Lists/ViewabilityHelper.js
        viewabilityConfig={{
          minimumViewTime: throttle,
          viewAreaCoveragePercentThreshold: 100,
          // waitForInteraction: true
        }}
      />
    );
  }
}
