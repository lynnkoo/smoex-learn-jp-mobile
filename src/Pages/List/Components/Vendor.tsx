import React from 'react';
import { View } from 'react-native';
import _ from 'lodash';
import BbkLabel from '@ctrip/bbk-component-label';
import BbkPriceDesc from '@ctrip/bbk-component-car-price-desc';
import { setOpacity } from '@ctrip/bbk-tokens';
import { withTheme } from '@ctrip/bbk-theming';
import { VehicleListStyle as style } from '../Styles';
import VerdorHeader from './VendorHeader';

export default withTheme(
  ({
    vendorLabelItems,
    priceDescProps,
    vendorHeaderProps,
    theme,
    soldOutLabel,
  }) => {
    // todo: handler
    const handler = () => { console.log('---------VerdorHeader'); };

    const soldoutLabelProps = {
      ...soldOutLabel,
      theme: {
        labelColor: theme.redBorder,
      },
    };

    const getLabelWrapStyle = (type) => {
      const rowTypes = ['normal', 'feature'];
      return [style.flexWrap, rowTypes.indexOf(type) > -1 && style.flexRow];
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

    return (
      <View style={[style.vendor, { borderBottomColor: setOpacity(theme.black, 0.1) }]}>
        <VerdorHeader
          onPress={handler}
          {...vendorHeaderProps}
        />

        {
          labelTypes.map(type => (
            <View style={getLabelWrapStyle(type)}>
              {
                vendorLabelItems[type].map(labelProps => <BbkLabel {...getLabelProps(labelProps, type)} />)
              }
            </View>
          ))
        }

        <View style={style.priceWrap}>
          <BbkPriceDesc {...priceDescProps} />
          {
            soldOutLabel && <BbkLabel {...soldoutLabelProps} />
          }
        </View>
      </View>
    );
  },
);
