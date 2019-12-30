import React, { useCallback } from 'react';
import { View } from 'react-native';
import { URL } from '@ctrip/crn';
import BbkLabel from '@ctrip/bbk-component-label';
import BbkPriceDesc from '@ctrip/bbk-component-car-price-desc';
import { border } from '@ctrip/bbk-tokens';
import { withTheme } from '@ctrip/bbk-theming';
import BbkTouchable from '@ctrip/bbk-component-touchable';
import VendorPriceTag from '@ctrip/bbk-component-vendor-price-tag';
import { VehicleListStyle as style } from '../Styles';
import { CarLog } from '../../../Util/Index';
import { ClickKey } from '../../../Constants/Index';
import VerdorHeader from './VendorHeader';
import {
  isDiffLocation,
} from '../../../Global/Cache/ListResSelectors';

export default withTheme(
  ({
    vendor,
    priceDescProps,
    vendorHeaderProps,
    theme,
    soldOutLabel,
    locationAndDate,
    reference,
    index,
    vehicleIndex,
  }) => {
    const onVerdorHeaderPress = useCallback(() => {
      const data: any = {
        ...locationAndDate,
        book: {
          sortNum: vehicleIndex,
          ...reference,
        },
      };
      // 跳转Trip详情页地址
      /* eslint-disable max-len */
      const ticket = new Date().getTime();
      const url = `/rn_ibu_car/_crn_config?CRNModuleName=rn_ibu_car&CRNType=1&page=details&fromurl=ctqlist&data=${encodeURIComponent(JSON.stringify(data))}&cache=${ticket}`;
      URL.openURL(url);
      CarLog.LogCode({ enName: ClickKey.C_LIST_VENDOR.KEY });
    }, [locationAndDate, reference, vehicleIndex]);

    const soldoutLabelProps = {
      ...soldOutLabel,
      theme: {
        labelColor: theme.redBorder,
      },
    };

    // useEffect(() => {
    //   console.log('【performance】Vendor Item ', vehicleName)
    // })

    return (
      <View style={[
        style.vendor,
        index !== 0 && {
          borderTopWidth: border.borderSizeXsm,
          borderTopColor: theme.grayBorder,
        },
      ]}
      >
        <VerdorHeader
          onPress={onVerdorHeaderPress}
          {...vendorHeaderProps}
        />

        <BbkTouchable onPress={onVerdorHeaderPress}>
          <VendorPriceTag
            vendor={vendor}
            showDistance
            showProvider
            isDiffLocation={isDiffLocation()}
            style={style.vendorPriceWrap}
          />

          <View style={style.priceWrap}>
            {priceDescProps && <BbkPriceDesc {...priceDescProps} />}
            {
              soldOutLabel && <BbkLabel {...soldoutLabelProps} />
            }
          </View>
        </BbkTouchable>
      </View>
    );
  },
);
