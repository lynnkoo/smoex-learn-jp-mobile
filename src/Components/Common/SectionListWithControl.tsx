import React, { Component } from 'react';
import {
  SectionList, SectionListProps, StyleSheet,
} from 'react-native';
import _ from 'lodash';
import { RefreshControl, LoadControl } from '@ctrip/crn';
import { color } from '@ctrip/bbk-tokens';
import { BbkUtils } from '@ctrip/bbk-utils';

const { isIos } = BbkUtils;

// @ts-ignore
interface SectionListWithControlProps extends SectionListProps<any> {
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
  onRefresh?: (any) => void;
  onLoadMore?: (any) => void;
  index?: number;
  refFn?: (any) => void;
  pullIcon?: string;
  loadingContent?: string;
}

interface SectionListWithControlState {
  refreshing: boolean;
  onLoading: boolean;
  refreshResult: boolean;
}

const styles = StyleSheet.create({
  controlWrap: {
    position: 'absolute',
    // refreshControl 的默认高度
    top: isIos ? -35 : 0,
    width: '100%',
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
    };
  }

  onScrollThrottle = () => {
    const { throttle } = this.props;
    return isIos ? this.onScroll : _.throttle(this.onScroll, throttle, { trailing: false });
  }

  triggerScroll = (event, debugInfo) => {
    const { threshold } = this.props;
    const { y } = event.nativeEvent.contentOffset;
    const { height } = event.nativeEvent.layoutMeasurement;
    const contentHeight = event.nativeEvent.contentSize.height;
    let load = false;
    let refresh = false;

    console.log(`${debugInfo}-->`, y + height, contentHeight);

    if (isIos) {
      if (y + height > contentHeight + threshold) {
        load = true;
      }
      if (y < -threshold) {
        refresh = true;
      }
    } else {
      if (y + height > contentHeight - threshold) {
        load = true;
      }
      if (y < threshold) {
        refresh = true;
      }
    }

    return {
      load,
      refresh,
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
    } = this.triggerScroll(event, 'onScroll');

    if (load) {
      this.setState({
        onLoading: true,
      });
    }

    if (refresh) {
      this.setState({
        refreshing: true,
      });
    }
  }

  onScrollEndDrag = (event) => {
    const {
      load,
      refresh,
    } = this.triggerScroll(event, 'onScrollEndDrag');

    if (load) {
      this.props.onLoadMore(() => {
        this.setState({
          onLoading: false,
        });
      });
    } else {
      this.setState({
        onLoading: false,
      });
    }

    if (refresh) {
      this.props.onRefresh(() => {
        this.setState({
          refreshing: false,
        });
      });
    } else {
      this.setState({
        refreshing: false,
      });
    }
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
    } = this.state;
    const {
      throttle = 50,
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
    } = this.props;

    return (
      <SectionList
        style={[style]}
        ref={this.refFn}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        renderSectionFooter={renderSectionFooter}
        sections={sections}
        keyExtractor={() => `${index}`}
        scrollEventThrottle={throttle}
        onScrollEndDrag={this.onScrollEndDrag}
        onScroll={this.onScrollThrottle()}
        // onScrollToIndexFailed={(index, highestMeasuredFrameIndex, averageItemLength) => {
        //   console.log('----------', index, highestMeasuredFrameIndex, averageItemLength)
        // }}
        // refreshControl={
        ListHeaderComponent={(
          // @ts-ignore
          <RefreshControl
            style={styles.controlWrap}
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
        ListFooterComponent={(
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
        )}
      />
    );
  }
}
