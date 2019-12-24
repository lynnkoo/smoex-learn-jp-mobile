import { StyleSheet } from 'react-native';
import {
  border, space, font,
} from '@ctrip/bbk-tokens';
import { BbkUtils } from '@ctrip/bbk-utils';

const { getPixel } = BbkUtils;

export const VehicleListStyle = StyleSheet.create({
  wrap: {
    paddingHorizontal: space.spaceXXL,
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
    overflow: 'hidden',
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
    borderBottomWidth: border.borderSizeSm,
  },
  moreText: {
    ...font.body2LightStyle,
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
});

export const placeHolder = null;
