import React, { useEffect } from 'react';
import { View } from 'react-native';
// eslint-disable-next-line
import _ from 'lodash';
import BbkVehicleName from '@ctrip/bbk-component-car-vehicle-name';
import BbkCarVehicleDesc from '@ctrip/bbk-component-car-vehicle-describe';
import BbkLabel from '@ctrip/bbk-component-label';
import BbkTouchable from '@ctrip/bbk-component-touchable';
import { setOpacity } from '@ctrip/bbk-tokens';
import { BbkUtils } from '@ctrip/bbk-utils';
import BbkCarRightIcon from '@ctrip/bbk-component-right-icon';
import { withTheme } from '@ctrip/bbk-theming';
import BbkCarImage from '@ctrip/bbk-component-car-image';
import { VehicleListStyle as style } from '../Styles';
import Verdor from '../../../Containers/VendorContainer';
import { listShowMore } from '../Texts';

const { selector } = BbkUtils;


export const Vehicle = withTheme(
  ({ item, section, theme }) => {
    const { recommendDesc, vehicleDesc } = section;
    const {
      imgUrl, vehicleImageLabel, vehicleLabelsHorizontal, vehicleLabels,
    } = vehicleDesc;

    useEffect(() => {
      // console.log('--------------Vehicle', _.get(section, 'vehicleHeader.vehicleName'))
    });

    return (
      <View style={[style.wrap, { backgroundColor: theme.backgroundColor }]}>
        <View style={[style.flexRow]}>
          <BbkCarImage
            source={{ uri: imgUrl }}
            resizeMode="cover"
            style={style.vehicleImage}
            labelText={vehicleImageLabel}
          />
          <View style={style.vehicleDesc}>
            <BbkCarVehicleDesc
              items={vehicleLabelsHorizontal}
              horizontal
            />
            <BbkCarVehicleDesc
              items={vehicleLabels}
            />
          </View>
        </View>

        {
          selector(
            recommendDesc,
            <BbkLabel
              text={recommendDesc}
              hasBorder
              labelStyle={[style.labelFlexLeft, style.labelStyle, { backgroundColor: setOpacity(theme.blueBase, 0.08) }]}
            />,
          )
        }

        {
          item.map((data, index) => (
            // eslint-disable-next-line
            <Verdor key={index} {...data} />
          ))
        }
      </View>
    );
  },
);

export const VehicleHeader = withTheme(
  ({ vehicleHeader, onLayout, theme }) => {
    const {
      vehicleName,
      groupName,
      isSimilar,
      isHotLabel,
    } = vehicleHeader;
    return (
      <View style={{ backgroundColor: theme.backgroundColor }} onLayout={onLayout}>
        <BbkVehicleName name={vehicleName} groupName={groupName} isSimilar={isSimilar} isHotLabel={isHotLabel} />
      </View>
    );
  },
);

export const VehicleFooter = withTheme(
  ({ moreNumber, onPress, theme }) => {
    const moreTextStyle = [style.moreText, {
      color: theme.blueBase,
    }];

    return selector(
      moreNumber,
      <BbkTouchable onPress={onPress}>
        <BbkCarRightIcon
          text={listShowMore(moreNumber)}
          style={[style.more, style.vehicleMarginBottom, {
            backgroundColor: theme.backgroundColor,
            borderBottomColor: theme.grayBorder,
          }]}
          textStyle={moreTextStyle}
          iconContent={'\uf2c7'}
          iconStyle={moreTextStyle}
        />
      </BbkTouchable>,
      <View style={style.vehicleMarginBottom} />,
    );
  },
);
