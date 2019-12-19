import React, { useCallback } from 'react';
import { View } from 'react-native';
import _ from 'lodash';
import memoizeOne from 'memoize-one';
import { URL } from '@ctrip/crn';
import BbkLabel from '@ctrip/bbk-component-label';
import BbkPriceDesc from '@ctrip/bbk-component-car-price-desc';
import { setOpacity } from '@ctrip/bbk-tokens';
import { withTheme } from '@ctrip/bbk-theming';
import BbkTouchable from '@ctrip/bbk-component-touchable';
import { VehicleListStyle as style } from '../Styles';
import { CarLog } from '../../../Util/Index';
import { ClickKey } from '../../../Constants/Index';
import VerdorHeader from './VendorHeader';

const getLabelWrapStyle = memoizeOne(
  (type) => {
    const rowTypes = ['normal', 'feature'];
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
    // locationAndDate,
    // reference,
  }) => {
    const onVerdorHeaderPress = useCallback(() => {
      // const data: any = {
      //   ...locationAndDate,
      //   book: reference,
      // };
      // TODO-DYY: 填写页新接口联调
      const data: any = {
        rentalLocation: {
          pickUp: {
            cid: 617,
            cname: '台北',
            country: '中國',
            area: {
              id: 'TPE',
              name: '桃園機場 (TPE)',
              lat: 25.079651,
              lng: 121.234217,
              type: 1,
            },
          },
          dropOff: {
            cid: 617,
            cname: '台北',
            country: '中國',
            area: {
              id: 'TPE',
              name: '桃園機場 (TPE)',
              lat: 25.079651,
              lng: 121.234217,
              type: 1,
            },
          },
          isShowDropOff: false,
        },
        rentalDate: {
          pickUp: {
            dateTime: '20191225100000',
          },
          dropOff: {
            dateTime: '20191229100000',
          },
        },
        book: {
          bomcode: 'TPE14088003TPE_10375_CDW_FRFB_Fees_GPS_PAI_TP_TPL_Taxes_ULM_0_0',
          paymode: 2,
          pstorecode: 'TPE14088003TPE',
          rstorecode: 'TPE14088003TPE',
          vehiclecode: '10375',
          vendorid: '14088003',
          vendorCode: 'SD0662',
          isredirect: true,
          packageid: 4845,
        },
      };

      // 跳转Trip详情页地址
      const url = `/rn_ibu_car/_crn_config?CRNModuleName=rn_ibu_car&CRNType=1&page=details&data=${encodeURIComponent(JSON.stringify(data))}`;
      URL.openURL(url);
      CarLog.LogCode({ enName: ClickKey.C_LIST_VENDOR.KEY });
    }, []);

    const soldoutLabelProps = {
      ...soldOutLabel,
      theme: {
        labelColor: theme.redBorder,
      },
    };

    const getLabelProps = (labelProps, type) => {
      const themeMap = {
        feature: {
          labelColor: theme.blueBg,
        },
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
    //   console.log('【performance】Vendor Item ', vehicleName, vendorIndex)
    // })

    return (
      <View style={[style.vendor, { borderBottomColor: setOpacity(theme.black, 0.1) }]}>
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
