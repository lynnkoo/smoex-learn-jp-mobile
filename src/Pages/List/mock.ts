import {
  tokenType, icon,
} from '@ctrip/bbk-tokens';
import { BbkUtils } from '@ctrip/bbk-utils';
import {
  listDay, days, Reviews, total,
} from './Texts';
import { VehicleListStyle as style } from './Styles';

const { getPixel, htmlDecode } = BbkUtils;


const vehicleLabelsHorizontal = [
  {
    text: '5',
    icon: {
      iconContent: '\uee86',
    },
  },
  {
    text: '2',
    icon: {
      iconContent: '\uee82',
    },
  },
  {
    text: '4',
    icon: {
      iconContent: '\uee7f',
    },
  },
];

const vehicleLabels = [
  {
    text: '1.5L',
    icon: {
      iconContent: '\uee81',
    },
  },
  {
    text: 'Air Conditioning',
    icon: {
      iconContent: '\uee7c',
    },
  },
  {
    text: 'Automatic',
    icon: {
      iconContent: '\uee7d',
    },
  },
];

const baseVendorLabel = {
  labelStyle: [
    style.labelFlexLeft,
    style.verndorLabel,
  ],
  iconStyle: {
    fontSize: getPixel(32),
  },
  size: tokenType.LabelSize.L,
  noBg: true,
};

export const vendorLabelItems: any = {
  distance: {
    ...baseVendorLabel,
    text: 'Direct distance from MTR Station 40 m',
    icon: {
      iconStyle: baseVendorLabel.iconStyle,
      iconContent: '\uee78',
    },
    colorType: tokenType.ColorType.BlueGray,
  },
  vendorDesc1: {
    ...baseVendorLabel,
    text: 'Unlimited Mileage',
    icon: {
      iconStyle: baseVendorLabel.iconStyle,
      iconContent: '\uef60',
    },
    colorType: tokenType.ColorType.BlueGray,
  },
  vendorDesc2: {
    ...baseVendorLabel,
    text: 'No Deductible',
    icon: {
      iconStyle: baseVendorLabel.iconStyle,
      iconContent: '\uee85',
    },
    colorType: tokenType.ColorType.BlueGray,
  },
  feature: {
    ...baseVendorLabel,
    text: 'Free Cancellation',
    icon: {
      iconStyle: baseVendorLabel.iconStyle,
      iconContent: '\uf2bf',
    },
  },
  activity: {
    ...baseVendorLabel,
    noBg: false,
    text: 'Free Cancellation',
    icon: {
      iconStyle: baseVendorLabel.iconStyle,
      iconType: 'primary',
      iconContent: '\uee8c',
    },
  },
  provider: {
    ...baseVendorLabel,
    text: 'service provided by Rentalcars',
    icon: {
      iconStyle: baseVendorLabel.iconStyle,
    },
  },
  soldOut: {
    ...baseVendorLabel,
    text: 'Will be sold out !',
    icon: {
      iconStyle: baseVendorLabel.iconStyle,
      iconContent: htmlDecode(icon.default.circleWithSighFilled),
    },
  },
};

vendorLabelItems.distanceDiff = {
  ...vendorLabelItems.distance,
  text: 'Pickup: Direct distance from MTR Station 40 m \nDropoff: Direct distance from MTR Station 400 m',
};

vendorLabelItems.distanceLong = {
  ...vendorLabelItems.distance,
  text: 'Direct distance from MTR Station 40 m Direct distance from MTR Station 40 m',
};

export const priceDescProps = {
  totalPrice: {
    price: 1400000000000,
    currency: 'AUD',
  },
  dayPrice: {
    price: 200000000000,
    currency: 'AUD',
  },
  originPrice: {
    price: 205000000000,
    currency: 'AUD',
  },
  totolText: total,
  dayText: `/${listDay}`,
};

const vendorHeaderProps = {
  vendorLogo: 'http://pic.c-ctrip.com/car/osd/ctrip/vendor_logo/Hertz_20180919.png',
  vendorName: '西翠租车',
  title: '国际知名',
  score: '4.5',
  totalScore: '5',
  scoreDesc: 'Excellent Car Condition Excellent Car Condition',
  commentDesc: `500 ${Reviews}`,
};

export const priceDescTotalProps = {
  totalPrice: {
    price: 200,
    currency: 'AUD',
  },
  originPrice: {
    price: 205,
    currency: 'AUD',
  },
  totolText: days(7),
};

const vendorListData = [
  {
    priceDescProps,
    vendorHeaderProps,
    vendorLabelItems,
  },
  {
    priceDescProps: {
      ...priceDescTotalProps,
      saleLabel: '62% OFF TODAY',
    },
    vendorLabelItems,
    distance: 'distanceLong',
    activity: null,
    soldOut: null,
    vendorHeaderProps: {
      ...vendorHeaderProps,
      scoreLow: true,
    },
  },
  {
    priceDescProps,
    vendorHeaderProps,
    vendorLabelItems,
    distance: 'distanceDiff',
    activity: null,
    soldOut: null,
  },
];

const vehicleHeader = {
  vehicleName: 'Nissan Sentra',
  groupName: 'Compact',
};

const vehicleDesc = {
  imgUrl: 'https://pic.c-ctrip.com/car/osd/online/vehicle_new/Nissan_Almera.png',
  vehicleImageLabel: 'shanghai brand',
  vehicleLabelsHorizontal,
  vehicleLabels,
};

export const listData = [{
  vehicleHeader: {
    ...vehicleHeader,
    vehicleName: `${vehicleHeader.vehicleName}1`,
    isSimilar: true,
    isHotLabel: true,
  },
  vehicleDesc,
  moreNumber: 4,
  recommendDesc: '“Oceania self-driving tour recommended, good mute effect”',
  data: [vendorListData],
},
{
  vehicleHeader: {
    ...vehicleHeader,
    vehicleName: `${vehicleHeader.vehicleName}2`,
  },
  vehicleDesc,
  data: [vendorListData],
},
{
  vehicleHeader: {
    ...vehicleHeader,
    vehicleName: `${vehicleHeader.vehicleName}3`,
  },
  vehicleDesc,
  data: [vendorListData],
},
];
