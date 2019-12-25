import React, { useCallback } from 'react';
import { View } from 'react-native';
import _ from 'lodash';
import memoizeOne from 'memoize-one';
import { URL } from '@ctrip/crn';
import BbkLabel from '@ctrip/bbk-component-label';
import BbkPriceDesc from '@ctrip/bbk-component-car-price-desc';
import { setOpacity, border } from '@ctrip/bbk-tokens';
import { withTheme } from '@ctrip/bbk-theming';
import BbkTouchable from '@ctrip/bbk-component-touchable';
import { VehicleListStyle as style } from '../Styles';
import { CarLog } from '../../../Util/Index';
import { ClickKey } from '../../../Constants/Index';
import VerdorHeader from './VendorHeader';

const getLabelWrapStyle = memoizeOne(
  (type) => {
    const rowTypes = ['negative', 'positive'];
    return [style.flexWrap, rowTypes.indexOf(type) > -1 && style.flexRow];
  },
);

export default withTheme(
  ({
    vendorLabelItems,
    priceDescProps,
    vendorHeaderProps,
    theme,
    soldOutLabel,
    locationAndDate,
    reference,
    index,
  }) => {
    const onVerdorHeaderPress = useCallback(() => {
      const data: any = {
        ...locationAndDate,
        book: reference,
      };
      // 跳转Trip详情页地址
      const url = `/rn_ibu_car/_crn_config?CRNModuleName=rn_ibu_car&CRNType=1&page=details&fromurl=ctqlist&data=${encodeURIComponent(JSON.stringify(data))}`;
      URL.openURL(url);
      CarLog.LogCode({ enName: ClickKey.C_LIST_VENDOR.KEY });
    }, [locationAndDate, reference]);

    const soldoutLabelProps = {
      ...soldOutLabel,
      theme: {
        labelColor: theme.redBorder,
      },
    };

    const getLabelProps = (labelProps, type) => {
      const themeMap = {
        // positive: {
        //   labelColor: theme.blueBg,
        // },
        promotion: {
          labelColor: theme.orangePrice,
          labelBgColor: setOpacity(theme.orangePrice, 0.1),
        },
        provider: {
          labelColor: theme.fontSubLight,
        },
      };
      return {
        ...labelProps,
        theme: themeMap[type],
      };
    };

    const labelTypes = _.keys(vendorLabelItems);

    // useEffect(() => {
    //   console.log('【performance】Vendor Item ', vehicleName)
    // })

    return (

      <View style={[style.vendor, index !== 0 && { borderTopWidth: border.borderSizeSm, borderTopColor: setOpacity(theme.black, 0.1) }]}>
        <VerdorHeader
          onPress={onVerdorHeaderPress}
          {...vendorHeaderProps}
        />

        <BbkTouchable onPress={onVerdorHeaderPress}>
          {
            labelTypes.map(type => (
              <View style={getLabelWrapStyle(type)} key={type}>
                {
                  vendorLabelItems[type].map(labelProps => <BbkLabel {...getLabelProps(labelProps, type)} key={labelProps.text} />)
                }
              </View>
            ))
          }

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
