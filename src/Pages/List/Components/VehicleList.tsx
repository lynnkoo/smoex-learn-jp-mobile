// eslint-disable-next-line
import React, { memo, useState, useEffect } from 'react';
// eslint-disable-next-line
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

const NoMatch = () => (
  <View style={styles.noMatchWrap}>
    <BbkListNoMatch
      type={ImgType.No_Search_Result}
      title={getSharkValue('listCombine_filterModalNoResult')}
      subTitle=""
      isShowOperateButton={false}
      isShowRentalDate={false}
      tip=""
      reQueryPress={() => {}}
      reQueryText=""
      theme={{}}
      style={{}}
      ptime=""
      rtime=""
    />
  </View>
);

const VehicleList = (props: any) => {
  const {
    sections,
    showMax,
    ...passThroughProps
  } = props;
  const [showMoreArr, setShowMoreArr] = useState(sections.map(({ data }) => data[0].length > showMax));
  const [showFooter, setShowFooter] = useState(false);


  const renderItem = (data) => {
    const vhicleData = data;
    if (showMoreArr[data.section.vehicleIndex]) {
      vhicleData.item = data.item.slice(0, showMax);
    }
    return (
      <Vehicle
        {...vhicleData}
      />
    );
  };

  const renderSectionHeader = ({ section: { vehicleHeader, vehicleIndex } }: sectionProps) => (
    <VehicleHeader
      vehicleHeader={vehicleHeader}
      onLayout={() => {
        if (vehicleIndex === sections.length - 1) {
          setShowFooter(true);
        }
      }}
    />
  );

  const [showLoginItem, setShowLoginItem] = useState(false);

  const isLogin = async () => {
    const $isLogin = await User.isLogin();
    setShowLoginItem(!$isLogin);
  };

  useEffect(() => {
    isLogin();
  });

  const onLogin = () => {
    User.toLogin();
  };

  const renderSectionFooter = ({ section: { data, vehicleIndex } }: sectionProps) => {
    const showMore = showMoreArr[vehicleIndex];
    const moreNumber = Math.max(_.get(data, '[0].length') - showMax, 0);

    const showMoreHandler = () => {
      setShowMoreArr(showMoreArr.map((value, i) => (i === vehicleIndex ? !value : value)));
    };

    return (
      <>
        <VehicleFooter
          moreNumber={showMore ? moreNumber : showMore}
          onPress={showMoreHandler}
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
  };

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

// const shouldUpdate = (prevProps, nextProps) => {
//   return _.get(prevProps, 'section.vehicleHeader.vehicleName') !== _.get(nextProps, 'section.vehicleHeader.vehicleName');
// };

// export default memo(VehicleList, shouldUpdate);
export default VehicleList;
