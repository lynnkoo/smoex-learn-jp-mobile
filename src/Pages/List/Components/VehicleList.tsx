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
import SectionListWithControl from '../../../Components/Common/SectionListWithControl';
import { Vehicle, VehicleFooter, VehicleHeader } from './Vehicle';
import LoginItem from './LoginItem';
import { User } from '../../../Util/Index';
import SelectedFilterItems from '../../../Containers/SelectedFilterItemsContainer';

const { selector, getPixel } = BbkUtils;

interface section {
  vehicleHeader: any;
  vehicleIndex: number;
  data: [];
}

interface sectionProps {
  section: section;
}

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

const VehicleList = (props: any) => {
  const {
    sections,
    showMax,
    ...passThroughProps
  } = props;
  const [showMoreArr, setShowMoreArr] = useState(() => sections.map(({ data }) => data[0].length > showMax));
  const [showFooter, setShowFooter] = useState(false);
  const sectionsLen = sections.length;

  const renderItem = useCallback((data) => {
    let { item } = data;
    if (showMoreArr[data.section.vehicleIndex]) {
      item = data.item.slice(0, showMax);
    }
    // console.log('【performance】renderItem ', data.section.vehicleHeader.vehicleName, showMoreArr[data.section.vehicleIndex], item.length);
    return (
      <Vehicle
        item={item}
        section={data.section}
      />
    );
  }, [showMax, showMoreArr]);

  const renderSectionHeader = useCallback(({ section: { vehicleHeader, vehicleIndex } }: sectionProps) => (
    <VehicleHeader
      vehicleHeader={vehicleHeader}
      vehicleIndex={vehicleIndex}
      sectionsLen={sectionsLen}
      setShowFooter={setShowFooter}
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

  // useEffect(() => {
  //   console.log('【performance】Vehicle List ', props.index, getGroupNameByIndex(props.index))
  // })

  const onLogin = () => {
    User.toLogin();
  };

  const renderSectionFooter = useCallback(({ section: { data, vehicleIndex } }: sectionProps) => {
    const showMore = showMoreArr[vehicleIndex];
    const moreNumber = Math.max(_.get(data, '[0].length') - showMax, 0);

    return (
      <>
        <VehicleFooter
          moreNumber={showMore ? moreNumber : showMore}
          setShowMoreArr={setShowMoreArr}
          vehicleIndex={vehicleIndex}
          showMoreArr={showMoreArr}
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
      showFooter={showFooter}
      sections={sections}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      renderSectionFooter={renderSectionFooter}
      ListFooterExtraComponent={<SelectedFilterItems />}
      ListEmptyComponent={<NoMatch />}
      threshold={50}
      {...passThroughProps}
    />
  );
};

export default memo(VehicleList);
