import React, {
  memo, useMemo, useCallback, useState, useEffect,
} from 'react';
import _ from 'lodash';
import { View, StyleSheet } from 'react-native';
import { BbkUtils } from '@ctrip/bbk-utils';
import { getSharkValue } from '@ctrip/bbk-shark';
import BbkListNoMatch from '@ctrip/bbk-component-list-no-match';
import { ImgType } from '@ctrip/bbk-component-list-no-match/dist/NoMatchImg';
import { color } from '@ctrip/bbk-tokens';
import SectionListWithControl,
{ SectionListWithControlProps } from '../../../Components/Common/SectionListWithControl';
import { Vehicle, VehicleFooter, VehicleHeader } from './Vehicle';
import LoginItem from './LoginItem';
import { User, CarLog } from '../../../Util/Index';
import { ClickKey } from '../../../Constants/Index';
import SelectedFilterItems from '../../../Containers/SelectedFilterItemsContainer';
import TipList from '../../../Containers/ListTipListContainer';

const { selector, getPixel } = BbkUtils;

const styles = StyleSheet.create({
  noMatchWrap: {
    backgroundColor: color.white,
    paddingTop: getPixel(64),
    paddingBottom: getPixel(40),
  },
});

const NoMatch = () => useMemo(
  () => (
    <View style={styles.noMatchWrap}>
      <BbkListNoMatch
        type={ImgType.No_Search_Result}
        title={getSharkValue('listCombine_filterModalNoResult')}
        subTitle=""
        isShowOperateButton={false}
        isShowRentalDate={false}
      />
    </View>
  ),
  [],
);

const cacheDom = {
  NoMatch: <NoMatch />,
  TipList: <TipList />,
  SelectedFilterItems: <SelectedFilterItems />,
};

interface section {
  vehicleHeader: any;
  vehicleIndex: number;
  data: [];
}

interface sectionProps {
  section: section;
}

export interface VehicleListProps extends SectionListWithControlProps {
  showMax?: number;
  scrollViewHeight?: number;
}

const getShowMoreArr = (sections, showMax) => sections.map(({ data }) => data[0].length > showMax);
const VehicleList = (props: VehicleListProps) => {
  const {
    sections,
    showMax,
    scrollViewHeight,
    ...passThroughProps
  } = props;
  const [showMoreArr, setShowMoreArr] = useState(() => getShowMoreArr(sections, showMax));
  const [vehicleHeight, setVehicleHeight] = useState(0);
  const [vehicleHeaderHeight, setVehicleHeaderHeight] = useState(0);
  const sectionsLen = sections.length;
  // android 少于 2 条数据时不展示打通，无法触发 scroll
  const shouldSetMinHeight = sectionsLen <= 1 && _.get(sections, '[0].data[0].length') <= 2;

  const onVehicleLayout = ({ nativeEvent }) => {
    const { height } = nativeEvent.layout;
    setVehicleHeight(height);
  };

  const renderItem = useCallback((data) => {
    let { item } = data;
    if (showMoreArr[data.section.vehicleIndex]) {
      item = data.item.slice(0, showMax);
    }
    return (
      <Vehicle
        item={item}
        section={data.section}
        onLayout={shouldSetMinHeight && onVehicleLayout}
      />
    );
  }, [shouldSetMinHeight, showMax, showMoreArr]);

  const onVehicleHeaderLayout = ({ nativeEvent }) => {
    const { height } = nativeEvent.layout;
    setVehicleHeaderHeight(height);
  };

  const renderSectionHeader = useCallback(
    ({ section: { vehicleHeader } }: sectionProps) => (
      <VehicleHeader
        vehicleHeader={vehicleHeader}
        onLayout={shouldSetMinHeight && onVehicleHeaderLayout}
      />
    ), [shouldSetMinHeight]);

  const [showLoginItem, setShowLoginItem] = useState(false);

  const isLogin = async () => {
    const $isLogin = await User.isLogin();
    setShowLoginItem(!$isLogin);
  };

  useEffect(() => {
    isLogin();
  }, []);

  useEffect(() => {
    setShowMoreArr(getShowMoreArr(sections, showMax));
  }, [sections, showMax]);

  const onLogin = async () => {
    CarLog.LogCode({ enName: ClickKey.C_LIST_LOG_IN.KEY });
    const res = await User.toLogin();
    if (res) {
      setShowLoginItem(false);
    }
  };

  const renderSectionFooter = useCallback((
    { section: { data, vehicleIndex, vehicleHeader } }: sectionProps) => {
    const showMore = showMoreArr[vehicleIndex];
    const length = _.get(data, '[0].length');
    const moreNumber = Math.max(length - showMax, 0);
    const { vehicleName }: any = vehicleHeader || {};
    const minHeightStyle = shouldSetMinHeight && {
      minHeight: scrollViewHeight - vehicleHeight - vehicleHeaderHeight,
    };

    return (
      <View style={minHeightStyle}>
        <VehicleFooter
          moreNumber={showMore ? moreNumber : showMore}
          setShowMoreArr={setShowMoreArr}
          vehicleIndex={vehicleIndex}
          showMoreArr={showMoreArr}
          vehicleName={vehicleName}
        />

        {
          selector(
            showLoginItem && vehicleIndex === 0,
            <LoginItem
              onLogin={onLogin}
            />,
          )
        }
      </View>
    );
  }, [
    showMoreArr,
    showMax,
    shouldSetMinHeight,
    scrollViewHeight,
    vehicleHeight,
    vehicleHeaderHeight,
    showLoginItem,
  ]);

  return (
    <SectionListWithControl
      // showFooter={showFooter}
      shouldSetMinHeight={shouldSetMinHeight}
      sections={sections}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      renderSectionFooter={renderSectionFooter}
      ListHeaderExtraComponent={cacheDom.TipList}
      ListFooterExtraComponent={cacheDom.SelectedFilterItems}
      ListEmptyComponent={cacheDom.NoMatch}
      threshold={50}
      {...passThroughProps}
    />
  );
};

export default memo(VehicleList);
