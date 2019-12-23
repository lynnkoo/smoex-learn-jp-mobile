import React, { Component, ReactElement } from 'react';
import {
  SectionList, SectionListProps, StyleSheet, View,
} from 'react-native';
import _ from 'lodash';
import { RefreshControl, LoadControl } from '@ctrip/crn';
import { color } from '@ctrip/bbk-tokens';
import { BbkUtils } from '@ctrip/bbk-utils';

const { isIos, lazySelector } = BbkUtils;

// @ts-ignore
interface SectionListWithControlProps extends SectionListProps<any> {
  sections: [];
  showFooter?: boolean;
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
  onRefresh?: (any) => void;
  onLoadMore?: (any) => void;
  index?: number;
  refFn?: (any) => void;
  pullIcon?: string;
  loadingContent?: string;
  ListHeaderExtraComponent?: ReactElement;
  ListFooterExtraComponent?: ReactElement;
  ListEmptyComponent?: ReactElement;
}

interface SectionListWithControlState {
  refreshing: boolean;
  onLoading: boolean;
  refreshResult: boolean;
  showAndroidLoad: boolean;
  showAndroidRefresh: boolean;
}

const styles = StyleSheet.create({
  controlWrap: {
    position: 'absolute',
    // refreshControl 的默认高度
    top: -35,
    width: '100%',
  },
  androidRefreshWrap: {
    marginTop: -35,
  },
  iconStyle: {
    color: color.blueBase,
  },
  textStyle: {
    color: color.fontPrimary,
  },
});

export default class SectionListWithControl extends Component<SectionListWithControlProps, SectionListWithControlState> {
  refreshControl = null;

  loadControl = null;

  refreshControlWrap = null;

  loadControlWrap = null;

  scroller = null;

  scrollerMoveLength = 0;

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
    };
  }

  onScrollThrottle = () => {
    const { throttle } = this.props;
    return isIos ? this.onScroll : _.throttle(this.onScroll, throttle, { trailing: false });
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

    // console.log(triggerEvent, y, height, contentHeight, threshold)

    if (isIos) {
      if (y + height > contentHeight + threshold) {
        load = true;
      }
      if (y < -threshold) {
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

    return {
      load,
      refresh,
      showAndroidLoad,
      showAndroidRefresh,
    };
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

    this.setState({
      onLoading: load,
      refreshing: refresh,
    });
  }

  onScrollBeginDrag = (event) => {
    if (isIos) {
      return;
    }

    const {
      load,
      refresh,
    } = this.triggerScroll(event, 'onScrollBeginDrag');
    const { throttle } = this.props;

    if (refresh && this.refreshControlWrap) {
      this.scrollerMoveLength = throttle;
      this.refreshControlWrap.setNativeProps({
        style: {
          paddingTop: this.scrollerMoveLength,
        },
      });
    }

    if (load && this.loadControlWrap) {
      this.scrollerMoveLength = throttle;
      this.loadControlWrap.setNativeProps({
        style: {
          paddingBottom: this.scrollerMoveLength,
        },
      });
    }
  }

  recoverMoveLength = () => {
    if (isIos) {
      return;
    }

    this.scrollerMoveLength = 0;
    if (this.refreshControlWrap) {
      this.refreshControlWrap.setNativeProps({
        style: {
          paddingTop: this.scrollerMoveLength,
        },
      });
    }

    if (this.loadControlWrap) {
      this.loadControlWrap.setNativeProps({
        style: {
          paddingBottom: this.scrollerMoveLength,
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

    const nextState: any = {
      showAndroidLoad,
      showAndroidRefresh,
    };

    if (load) {
      const { showFooter } = this.props;
      if (!showFooter) {
        return;
      }
      this.props.onLoadMore(() => {
        this.setState({
          onLoading: false,
        });
      });
    } else {
      nextState.onLoading = false;
    }

    if (refresh) {
      this.props.onRefresh(() => {
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
    if (this.props.refFn) {
      this.props.refFn(ref);
    }
    this.scroller = ref;
  }

  render() {
    const {
      refreshing,
      onLoading,
      refreshResult,
      showAndroidRefresh,
    } = this.state;
    const {
      throttle,
      showFooter,
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
        style={isIos ? styles.controlWrap : (!showAndroidRefresh && styles.androidRefreshWrap)}
        iconStyle={styles.iconStyle}
        textStyle={styles.textStyle}
        // @ts-ignore
        ref={ref => {this.refreshControl = ref}} // eslint-disable-line
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
        ref={ref => {this.loadControl = ref}}
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
        style={[style, {marginBottom: 200}]}
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
        onScroll={this.onScrollThrottle()}
        onMomentumScrollEnd={isIos && this.onMomentumScrollEnd}
        ListHeaderComponent={listHeaderComponent}
        ListFooterComponent={listFooterComponent}
        ListEmptyComponent={ListEmptyComponent}
      />
    );
  }
}
