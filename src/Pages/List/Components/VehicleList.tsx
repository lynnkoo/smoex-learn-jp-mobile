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
}

const getShowMoreArr = (sections, showMax) => sections.map(({ data }) => data[0].length > showMax);
// android 少于 2 条数据时不展示打通，无法触发 scroll
// const getShowFooter = sections => (isIos ? sections.length <= 0 : false);
const VehicleList = (props: VehicleListProps) => {
  const {
    sections,
    showMax,
    ...passThroughProps
  } = props;
  const [showMoreArr, setShowMoreArr] = useState(() => getShowMoreArr(sections, showMax));
  // android 少于 2 条数据时不展示打通，无法触发 scroll
  // const [showFooter, setShowFooter] = useState(() => getShowFooter(sections));
  const sectionsLen = sections.length;

  const renderItem = useCallback((data) => {
    let { item } = data;
    if (showMoreArr[data.section.vehicleIndex]) {
      item = data.item.slice(0, showMax);
    }
    return (
      <Vehicle
        item={item}
        section={data.section}
      />
    );
  }, [showMax, showMoreArr]);

  const renderSectionHeader = useCallback(
    ({ section: { vehicleHeader, vehicleIndex } }: sectionProps) => (
      <VehicleHeader
        vehicleHeader={vehicleHeader}
        vehicleIndex={vehicleIndex}
        sectionsLen={sectionsLen}
        // setShowFooter={setShowFooter}
      />
    ), [sectionsLen]);

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

  const onLogin = () => {
    CarLog.LogCode({ enName: ClickKey.C_LIST_LOG_IN.KEY });
    User.toLogin();
  };

  const renderSectionFooter = useCallback((
    { section: { data, vehicleIndex, vehicleHeader } }: sectionProps) => {
    const showMore = showMoreArr[vehicleIndex];
    const moreNumber = Math.max(_.get(data, '[0].length') - showMax, 0);
    const { vehicleName }: any = vehicleHeader || {};

    return (
      <>
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
      </>
    );
  }, [showLoginItem, showMax, showMoreArr]);

  return (
    <SectionListWithControl
      // showFooter={showFooter}
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
