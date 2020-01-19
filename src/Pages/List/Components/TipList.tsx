import React from 'react';
import { View } from 'react-native';
import { BbkUtils } from '@ctrip/bbk-utils';
import BbkTips, { TIPS_TYPE } from '@ctrip/bbk-component-tips';
import { FilterType } from '@ctrip/bbk-logic';
import { color } from '@ctrip/bbk-tokens';
import { CarLog } from '../../../Util/Index';
import { ClickKey } from '../../../Constants/Index';

interface IFilterType extends FilterType {
  filterLabels: any;
}

interface IPropsType {
  promotionFilterText: string;
  promotionFilterCode: string;
  promotionFilterSelected: boolean;
  selectedFilters: IFilterType;
  updateSelectedFilter?: (data: any) => void;
}

const ListTips = (props: IPropsType) => {
  const {
    promotionFilterText, promotionFilterCode, selectedFilters, promotionFilterSelected,
  } = props;

  const handleTipPress = () => {
    const newBitsFilter = [...selectedFilters.bitsFilter];
    const newFilterLabels = [...selectedFilters.filterLabels];
    const curCodeIndex = selectedFilters.bitsFilter.findIndex(f => f === promotionFilterCode);
    if (curCodeIndex > -1) {
      newBitsFilter.splice(curCodeIndex, 1);
      newFilterLabels.splice(curCodeIndex, 1);
    } else {
      newBitsFilter.push(promotionFilterCode);
      newFilterLabels.push({
        code: promotionFilterCode,
        name: promotionFilterText,
      });
    }

    props.updateSelectedFilter({
      bitsFilter: newBitsFilter,
      filterLabels: newFilterLabels,
    });

    CarLog.LogCode({ enName: ClickKey.C_LIST_PROMOTION_FILTER.KEY });
  };


  if (!promotionFilterText) return null;
  return (
    <View style={{
      paddingVertical: BbkUtils.getPixel(24),
      paddingHorizontal: BbkUtils.getPixel(32),
      backgroundColor: color.white,
      zIndex: 1,
    }}
    >
      <BbkTips
        type={TIPS_TYPE.PROMOTE_FLIGHT}
        isPrometFlightChecked={promotionFilterSelected}
        text={promotionFilterText}
        onTipsPress={handleTipPress}
        style={{ paddingLeft: BbkUtils.getPixel(10), paddingRight: BbkUtils.getPixel(10) }}
      />
    </View>
  );
};
export default ListTips;
