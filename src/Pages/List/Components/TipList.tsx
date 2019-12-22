import React from 'react';
import { View } from 'react-native';
import { BbkUtils } from '@ctrip/bbk-utils';
import BbkTips, { TIPS_TYPE } from '@ctrip/bbk-component-tips';

interface IPropsType {
  promotionFilterText: string;
  promotionFilterSelected: boolean;
}

const ListTips = (props: IPropsType) => {
  const { promotionFilterText, promotionFilterSelected } = props;
  if (!promotionFilterText) return null;
  return (
    <View style={{ paddingVertical: BbkUtils.getPixel(24), paddingHorizontal: BbkUtils.getPixel(32) }}>
      <BbkTips
        type={TIPS_TYPE.PROMOTE_FLIGHT}
        isPrometFlightChecked={promotionFilterSelected}
        text={promotionFilterText}
        onTipsPress={() => { }}
      />

    </View>
  );
};
export default ListTips;
