import { StyleSheet } from 'react-native';
import {
  border, space, font, icon,
} from '@ctrip/bbk-tokens';
import { BbkUtils, BbkChannel } from '@ctrip/bbk-utils';

const { getPixel, isAndroid } = BbkUtils;

export const VehicleListStyle = StyleSheet.create({
  wrap: {
    paddingHorizontal: space.spaceXXL,
  },
  vehicleImgWrap: {
    borderTopWidth: border.borderSizeXsm,
  },
  labelFlexLeft: {
    justifyContent: 'flex-start',
  },
  labelStyle: {
    height: getPixel(40),
    paddingLeft: space.spaceL,
    borderWidth: 0,
    marginTop: space.spaceXL,
  },
  vendor: {
    paddingTop: space.spaceXXL,
    paddingBottom: space.spaceXXL,
    // overflow: 'hidden',
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexWrap: {
    flexWrap: 'wrap',
  },
  priceWrap: {
    alignItems: 'flex-end',
  },
  verndorLabel: {
    marginBottom: space.spaceL,
    alignItems: 'flex-start',
  },
  vehicleMarginBottom: {
    marginBottom: space.spaceL,
  },
  more: {
    paddingVertical: space.spaceXXL,
    // borderBottomWidth: border.borderSizeXsm,
  },
  moreText: {
    ...font.body2LightStyle,
  },
  moreIcon: {
    marginLeft: space.spaceS,
    fontFamily: icon.iconFamily,
  },
  vehicleImage: {
    width: getPixel(335),
    height: getPixel(223),
  },
  vehicleDesc: {
    marginTop: space.spaceXXL,
    marginLeft: space.spaceL,
  },
  verdorHeader: {
    minHeight: getPixel(54),
    alignItems: 'center',
  },
  scoreLabel: {
    marginLeft: space.spaceM,
    marginRight: space.spaceS,
  },
  comment: {
    marginLeft: space.spaceS,
  },
  vendorPriceWrap: {
    marginLeft: BbkChannel.isTrip() ? -space.spaceS : -space.spaceXS,
    paddingRight: isAndroid ? space.spaceXXL : 0,
  },
  vehicleHeaderWrap: {
    borderBottomWidth: 0,
  },
  showMoreWrap: {
    borderTopWidth: border.borderSizeXsm,
  },
});

export const placeHolder = null;
