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
{
  SectionListWithControlProps,
}
  from '../../../Components/Common/SectionListWithControl';
import { Vehicle, VehicleHeader } from './Vehicle';
import { User } from '../../../Util/Index';
import SelectedFilterItems from '../../../Containers/SelectedFilterItemsContainer';
import TipList from '../../../Containers/ListTipListContainer';
import SectionFooterContainer from '../../../Containers/VehicleListSectionFooterContainer';

const { getPixel } = BbkUtils;

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
  NoMatch: (
    <>
      <NoMatch />
      <SelectedFilterItems />
    </>
  ),
  TipList: <TipList />,
  SelectedFilterItems: <SelectedFilterItems />,
};

interface section {
  vehicleHeader: any;
  vehicleIndex: number;
  data: [];
}

interface SectionProps {
  section: section;
}

export interface VehicleListProps extends SectionListWithControlProps {
  showMax?: number;
}

const getShowMoreArr = (sections, showMax) => sections.map(({ data }) => data[0].length > showMax);
const VehicleList = (props: VehicleListProps) => {
  const {
    sections,
    showMax,
    scrollDownCallback,
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
    const { item } = data;
    return (
      <Vehicle
        item={item}
        section={data.section}
        onLayout={shouldSetMinHeight && onVehicleLayout}
        showMax={showMoreArr[data.section.vehicleIndex] ? showMax : item.length}
      />
    );
  }, [shouldSetMinHeight, showMax, showMoreArr]);

  const onVehicleHeaderLayout = ({ nativeEvent }) => {
    const { height } = nativeEvent.layout;
    setVehicleHeaderHeight(height);
  };

  const renderSectionHeader = useCallback(
    ({ section: { vehicleHeader } }: SectionProps) => (
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

  const renderSectionFooter = useCallback(sectionProps => (
    <SectionFooterContainer
      showMax={showMax}
      shouldSetMinHeight={shouldSetMinHeight}
      sectionProps={sectionProps}
      vehicleTotalHeight={vehicleHeight + vehicleHeaderHeight}
      sectionsLen={sectionsLen}
      showMoreArr={showMoreArr}
      setShowMoreArr={setShowMoreArr}
      showLoginItem={showLoginItem}
      setShowLoginItem={setShowLoginItem}
    />
  ), [
    showMoreArr,
    showMax,
    shouldSetMinHeight,
    vehicleHeight,
    vehicleHeaderHeight,
    showLoginItem,
    sectionsLen,
  ]);

  return (
    <SectionListWithControl
      // showFooter={showFooter}
      sections={sections}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      renderSectionFooter={renderSectionFooter}
      ListHeaderExtraComponent={cacheDom.TipList}
      // ListFooterExtraComponent={cacheDom.SelectedFilterItems}
      ListEmptyComponent={cacheDom.NoMatch}
      threshold={50}
      scrollDownCallback={scrollDownCallback}
      {...passThroughProps}
    />
  );
};

export default memo(VehicleList);
