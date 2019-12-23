import React from 'react';
import { View } from 'react-native';
import { BbkUtils } from '@ctrip/bbk-utils';
import BbkTips, { TIPS_TYPE } from '@ctrip/bbk-component-tips';
import { FilterType } from '@ctrip/bbk-logic';

interface IPropsType {
  promotionFilterText: string;
  promotionFilterCode: string;
  promotionFilterSelected: boolean;
  selectedFilters: FilterType;
  updateSelectedFilter?: (data: any) => void;
}

const ListTips = (props: IPropsType) => {
  const {
    promotionFilterText, promotionFilterCode, selectedFilters, promotionFilterSelected,
  } = props;

  const handleTipPress = () => {
    const newBitsFilter = selectedFilters.bitsFilter;
    const curCodeIndex = selectedFilters.bitsFilter.findIndex(f => f === promotionFilterCode);
    if (curCodeIndex > -1) {
      newBitsFilter.splice(curCodeIndex, 1);
    } else {
      newBitsFilter.push(promotionFilterCode);
    }

    props.updateSelectedFilter({
      bitsFilter: newBitsFilter,
    });

    // todo log
  };


  if (!promotionFilterText) return null;
  return (
    <View style={{ paddingVertical: BbkUtils.getPixel(24), paddingHorizontal: BbkUtils.getPixel(32) }}>
      <BbkTips
        type={TIPS_TYPE.PROMOTE_FLIGHT}
        isPrometFlightChecked={promotionFilterSelected}
        text={promotionFilterText}
        onTipsPress={handleTipPress}
      />

    </View>
  );
};
export default ListTips;
