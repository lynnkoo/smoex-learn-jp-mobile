import React, {
  memo,
} from 'react';
import _ from 'lodash';
import { View } from 'react-native';
import { BbkUtils } from '@ctrip/bbk-utils';
import {
  controlHeight,
}
  from '../../../Components/Common/SectionListWithControl';
import { VehicleFooter } from './Vehicle';
import LoginItem from './LoginItem';
import { User, CarLog } from '../../../Util/Index';
import { ClickKey } from '../../../Constants/Index';
import SelectedFilterItems from '../../../Containers/SelectedFilterItemsContainer';

const { selector, fixIOSOffsetBottom } = BbkUtils;

const cacheDom = {
  SelectedFilterItems: <SelectedFilterItems />,
};

const SectionFooter = memo(({
  shouldSetMinHeight,
  scrollViewHeight,
  sectionProps,
  vehicleTotalHeight,
  showMax,
  sectionsLen,
  showMoreArr,
  setShowMoreArr,
  showLoginItem,
  setShowLoginItem,
  fetchListBatchQuery,
}: any) => {
  const { section: { data, vehicleIndex, vehicleHeader } } = sectionProps;
  const showMore = showMoreArr[vehicleIndex];
  const { vehicleName }: any = vehicleHeader || {};
  const minHeight = shouldSetMinHeight
    ? scrollViewHeight - fixIOSOffsetBottom(vehicleTotalHeight + controlHeight)
    : 0;
  const length = _.get(data, '[0].length');
  const moreNumber = Math.max(length - showMax, 0);

  const onLogin = async () => {
    CarLog.LogCode({ enName: ClickKey.C_LIST_LOG_IN.KEY });
    const res = await User.toLogin();
    if (res) {
      setShowLoginItem(false);
      // 重新加载数据，更新优惠信息
      fetchListBatchQuery();
    }
  };

  return (
    <View style={{
      minHeight,
    }}
    >
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

      {
        vehicleIndex === sectionsLen - 1 && cacheDom.SelectedFilterItems
      }
    </View>
  );
});

export default SectionFooter;
