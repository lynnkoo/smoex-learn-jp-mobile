import React, {
  useMemo,
} from 'react';
import { View, StyleSheet } from 'react-native';
import { color } from '@ctrip/bbk-tokens';
import { BbkUtils } from '@ctrip/bbk-utils';
import { getSharkValue } from '@ctrip/bbk-shark';
import BbkListNoMatch from '@ctrip/bbk-component-list-no-match';
import { ImgType } from '@ctrip/bbk-component-list-no-match/dist/NoMatchImg';
import SelectedFilterItems from '../../../Containers/SelectedFilterItemsContainer';
import {
  controlHeight,
}
  from '../../../Components/Common/SectionListWithControl';

const { getPixel, fixIOSOffsetBottom } = BbkUtils;

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

const FilterNoMatch = ({ scrollViewHeight }: any) => (
  <View style={{ minHeight: scrollViewHeight - fixIOSOffsetBottom(controlHeight) }}>
    <NoMatch />
    <SelectedFilterItems />
  </View>
);

export default FilterNoMatch;
