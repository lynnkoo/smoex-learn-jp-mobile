import _ from 'lodash';
import {
  tokenType, icon,
} from '@ctrip/bbk-tokens';
import { BbkUtils } from '@ctrip/bbk-utils';
import {
  listDay, Reviews, total,
} from './Texts';
import { VehicleListStyle as style } from './Styles';

const { getPixel, htmlDecode } = BbkUtils;

const showMax = 2;

// todo: memoize
const getVehicleItemData = _.memoize(
  (vehicleList, vehicleCode) => {
    const vehicle = _.find(vehicleList, {
      vehicleCode,
    }) || {};
    const {
      name,
      groupName,
      isHot,
      brandEName,
      passengerNo,
      luggageNo,
      doorNo,
      transmissionName,
      imageList = [],
    } = vehicle;
    return {
      vehicleHeader: {
        // todo
        vehicleName: name,
        groupName,
        // todo
        isSimilar: true,
        isHotLabel: isHot,
      },
      vehicleDesc: {
        // todo
        imgUrl: `http:${imageList[0]}`,
        // todo
        vehicleImageLabel: brandEName,
        vehicleLabelsHorizontal: [
          {
            text: passengerNo,
            icon: {
              iconContent: '\uee86',
            },
          },
          {
            text: luggageNo,
            icon: {
              iconContent: '\uee82',
            },
          },
          {
            text: doorNo,
            icon: {
              iconContent: '\uee7f',
            },
          },
        ],
        vehicleLabels: [
          {
            // todo: 排量?
            text: '1.5L',
            icon: {
              iconContent: '\uee81',
            },
          },
          {
            // todo: 空调？
            text: 'Air Conditioning',
            icon: {
              iconContent: '\uee7c',
            },
          },
          {
            text: transmissionName,
            icon: {
              iconContent: '\uee7d',
            },
          },
        ],
      },
    };
  },
);

const getPriceDescProps = (priceInfo) => {
  const {
    currentOriginalDailyPrice, currentTotalPrice, currentCurrencyCode,
  } = priceInfo;
  return {
    totalPrice: {
      price: currentTotalPrice,
      currency: currentCurrencyCode,
    },
    dayPrice: {
      price: 200000000000,
      currency: 'AUD',
    },
    originPrice: {
      price: currentOriginalDailyPrice,
      currency: currentCurrencyCode,
    },
    totolText: total,
    dayText: `/${listDay}`,
    // todo: 日价和总价
    // originPrice: {
    //   price: 205,
    //   currency: 'AUD',
    // },
    // totolText: days(7),
    // todo: ?
    saleLabel: '62% OFF TODAY',
  };
};

const getVendorLabel = (colorType?: string, noBg: boolean = true, iconType?: string) => ({ text, iconContent }: {text:string, iconContent?: string}) => ({
  labelStyle: [
    style.labelFlexLeft,
    style.verndorLabel,
  ],
  icon: {
    iconStyle: {
      fontSize: getPixel(32),
    },
    iconContent,
  },
  text,
  colorType,
  size: tokenType.LabelSize.L,
  noBg,
  iconType,
});

const getSoldOutLabel = () => getVendorLabel()({
  // todo: shark
  text: 'Will be sold out !',
  iconContent: htmlDecode(icon.default.circleWithSighFilled),
});

const getVendorLabelItems = (vendor) => {
  const { pStoreRouteDesc, rStoreRouteDesc } = vendor;

  const getNormalVendorLabel = getVendorLabel(tokenType.ColorType.BlueGray);
  const getFeatureVendorLabel = getVendorLabel();
  const getPromotionVendorLabel = getVendorLabel(null, false, 'primary');

  return {
    // todo: vendorTag、serviceTagList、extendServiceTagList、positiveTagList、negativeTagList、evaluation 评分标签？
    distance: [
      getNormalVendorLabel({
        text: `${pStoreRouteDesc}${rStoreRouteDesc ? `\n${rStoreRouteDesc}` : ''}`,
        iconContent: '\uee78',
      }),
    ],
    normal: [
      getNormalVendorLabel({
        text: 'Unlimited Mileage',
        iconContent: '\uef60',
      }),
      getNormalVendorLabel({
        text: 'No Deductible',
        iconContent: '\uee85',
      }),
    ],
    feature: [
      getFeatureVendorLabel({
        text: 'Free Cancellation',
        iconContent: '\uf2bf',
      }),
    ],
    promotion: [
      getPromotionVendorLabel({
        text: 'Trip.com Flyer Exclusive',
        iconContent: '\uee8c',
      }),
    ],
    provider: [
      getNormalVendorLabel({
        text: 'service provided by Rentalcars',
      }),
    ],
  };
};

const getVendorHeaderProps = (vendor) => {
  const {
    vendorLogo, vendorName, vendorTag = {}, commentInfo = {},
  } = vendor;
  const {
    commentCount, vendorDesc = 'test',
  } = commentInfo;
  return {
    vendorLogo,
    vendorName,
    title: vendorTag.title,
    scoreDesc: vendorDesc,
    commentDesc: `${commentCount} ${Reviews}`,
    // todo: 低评分
    score: '4.5',
    totalScore: '5',
    // scoreLow: true,
  };
};

const getVendorItemData = (vendor) => {
  const { priceInfo } = vendor;
  const priceDescProps = getPriceDescProps(priceInfo);
  const vendorLabelItems = getVendorLabelItems(vendor);
  const soldOutLabel = getSoldOutLabel();
  const vendorHeaderProps = getVendorHeaderProps(vendor);
  return {
    priceDescProps,
    vendorLabelItems,
    soldOutLabel,
    vendorHeaderProps,
  };
};

const getVendorListData = vendorPriceList => _.map(vendorPriceList, (vendor) => {
  const vendorItemData = getVendorItemData(vendor);
  return vendorItemData;
});

export const getVehicleListData = (mockServer) => {
  const { productGroups, vehicleList } = mockServer;
  const groupListData = productGroups.map((group) => {
    const { productList } = group;
    const vehicleListData = productList.map((product) => {
      const { vehicleCode, vendorPriceList } = product;
      const vehicleItemData = getVehicleItemData(vehicleList, vehicleCode);
      const vendorListData = getVendorListData(vendorPriceList);
      return {
        ...vehicleItemData,
        moreNumber: vendorPriceList.length - showMax,
        // todo?
        recommendDesc: '',
        data: [vendorListData.splice(0, 5)],
      };
    });
    return vehicleListData;
  });
  return groupListData.splice(0, 5);
  // return groupListData;
};

export const placeHolder = null;
