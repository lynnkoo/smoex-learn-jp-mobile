import { color, setOpacity } from '@ctrip/bbk-tokens';

export const themeLight = {
  vendorDescLowColor: color.fontSubDark,
  vendorDescColor: color.blueIcon,
  scrollBackgroundColor: color.grayBg,
  blueBase: color.blueBase,
  black: color.black,
  grayBorder: color.grayBorder,
  blueBg: color.blueBg,
  orangePrice: color.orangePrice,
  fontSubLight: color.fontSubLight,
  redBorder: color.redBorder,
};

export const themeDark = {
  vendorDescLowColor: color.fontSubDark,
  vendorDescColor: color.white,
  scrollBackgroundColor: color.black,
  blueBase: color.blueBase,
  black: color.white,
  grayBorder: setOpacity(color.white, 0.7),
  blueBg: color.blueBg,
  orangePrice: color.orangePrice,
  fontSubLight: setOpacity(color.white, 0.7),
  redBorder: color.redBorder,
  blue: {
    labelColor: color.white,
  },
  fontPrimaryColor: color.white,
};
