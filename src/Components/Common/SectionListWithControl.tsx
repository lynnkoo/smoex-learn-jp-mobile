import React, { Component, ReactElement } from 'react';
import {
  SectionList, SectionListProps, StyleSheet,
} from 'react-native';
import _ from 'lodash';
import { RefreshControl, LoadControl } from '@ctrip/crn';
import { color } from '@ctrip/bbk-tokens';
import { BbkUtils } from '@ctrip/bbk-utils';

const { isIos, selector } = BbkUtils;

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

  scoller = null;

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
  triggerScroll = (event, triggerEnd = false) => {
    const { threshold } = this.props;
    let { showAndroidLoad, showAndroidRefresh } = this.state;
    const { y } = event.nativeEvent.contentOffset;
    const { height } = event.nativeEvent.layoutMeasurement;
    const contentHeight = event.nativeEvent.contentSize.height;
    let load = false;
    let refresh = false;

    // if(triggerEnd) {
    //   console.log('onScrollEndDrag ', y, height, contentHeight, threshold)
    // } else {
    //   console.log('onScroll ', y, height, contentHeight, threshold)
    // }

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

  onScrollEndDrag = (event) => {
    const {
      load,
      refresh,
      showAndroidLoad,
      showAndroidRefresh,
    } = this.triggerScroll(event, true);

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
    this.scoller = ref;
  }

  render() {
    const {
      refreshing,
      onLoading,
      refreshResult,
      showAndroidRefresh,
    } = this.state;
    const {
      throttle = 50,
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
      ListFooterExtraComponent,
      ListEmptyComponent,
    } = this.props;

    return (
      <SectionList
        style={[style]}
        ref={this.refFn}
        initialNumToRender={initialNumToRender}
        endFillColor={endFillColor}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        renderSectionFooter={renderSectionFooter}
        sections={sections}
        keyExtractor={() => `${index}`}
        scrollEventThrottle={throttle}
        onScrollEndDrag={this.onScrollEndDrag}
        onScroll={this.onScrollThrottle()}
        onMomentumScrollEnd={isIos && this.onMomentumScrollEnd}
        ListHeaderComponent={(
          // @ts-ignore
          <RefreshControl
            style={isIos ? styles.controlWrap : (!showAndroidRefresh && styles.androidRefreshWrap)}
            iconStyle={styles.iconStyle}
            textStyle={styles.textStyle}
            // @ts-ignore
            ref={ref => this.refreshControl = ref} // eslint-disable-line
            // @ts-ignore
            isRefreshing={refreshing}
            refreshResult={refreshResult}
            pullIcon={pullIcon}
            pullStartContent={pullStartContent}
            pullContinueContent={pullContinueContent}
            refreshingIcon={refreshingIcon}
            refreshingContent={refreshingContent}
          />
        )}
        ListFooterComponent={selector(
          showFooter,
          <>
            {ListFooterExtraComponent}
            <LoadControl
              style={styles.controlWrap}
              iconStyle={styles.iconStyle}
              textStyle={styles.textStyle}
              // eslint-disable-next-line
              ref={ref => this.loadControl = ref}
              isLoading={onLoading}
              noMore={noMore}
              noMoreContent={noMoreContent}
              noticeContent={noticeContent}
              loadingContent={loadingContent}
            />
          </>
          ,
        )}
        ListEmptyComponent={ListEmptyComponent}
      />
    );
  }
}
