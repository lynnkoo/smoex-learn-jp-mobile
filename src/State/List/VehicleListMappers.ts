import _ from 'lodash';
import {
  tokenType,
  icon,
} from '@ctrip/bbk-tokens';

import { BbkUtils } from '@ctrip/bbk-utils';
import { Utils } from '../../Util/Index';
import {
  listDay, Reviews, total,
} from '../../Pages/List/Texts';
import { VehicleListStyle as style } from '../../Pages/List/Styles';
import { getVehAndProductList, getVehGroupList, isDiffLocation } from '../../Global/Cache/ListResSelectors';

const { getPixel, htmlDecode } = BbkUtils;
let count = 0;

// todo: memoize
const getVehicleItemData = (vehicleList, vehicleCode) => {
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
    // todo: 没有空调时是否要出 hasConditioner
    conditionerDesc,
    transmissionName,
    displacement,
    imageList = [],
    isSpecialized,
    recommendDesc,
  } = vehicle;
  count += 1;
  const vehicleLabels = [
    displacement && {
      text: displacement,
      icon: {
        iconContent: '\uee81',
      },
    },
    conditionerDesc && {
      text: conditionerDesc,
      icon: {
        iconContent: '\uee7c',
      },
    },
    transmissionName && {
      text: transmissionName,
      icon: {
        iconContent: '\uee7d',
      },
    },
  ];
  return {
    vehicleHeader: {
      // todo: test
      vehicleName: `${name} ${count}`,
      // vehicleName: name,
      groupName,
      isSimilar: !isSpecialized,
      isHotLabel: isHot,
    },
    vehicleDesc: {
      imgUrl: Utils.fullImgProtocal(imageList[0]),
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
      vehicleLabels: vehicleLabels.filter(v => v),
    },
    recommendDesc,
  };
};

const getPriceDescProps = (priceInfo, privilegesPromotions = {}) => {
  const {
    currentOriginalDailyPrice, currentTotalPrice, currentCurrencyCode, currentDailyPrice,
  } = priceInfo;
  const { title }: any = privilegesPromotions;
  // 国内资源可能没有天价，因为异地还车费不确定
  return {
    totalPrice: {
      price: currentTotalPrice,
      currency: currentCurrencyCode,
    },
    dayPrice: {
      price: currentDailyPrice,
      currency: currentCurrencyCode,
    },
    originPrice: {
      // todo: 没有日价时需要取总价
      price: currentOriginalDailyPrice,
      currency: currentCurrencyCode,
    },
    totolText: total,
    // todo: 没有日价时需要取总价
    // totolText: days(7),
    dayText: `/${listDay}`,
    [title && 'saleLabel']: title,
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
    iconType,
  },
  text,
  colorType,
  size: tokenType.LabelSize.L,
  noBg,
});

const getSoldOutLabel = text => text && getVendorLabel()({
  text,
  iconContent: htmlDecode(icon.default.circleWithSighFilled),
});

interface labelList {
  distance: {};
  provider?: {};
  normal?: {};
  feature?: {};
  promotion?: {};
}

const getVendorLabelItems = (vendor) => {
  const {
    pStoreRouteDesc, rStoreRouteDesc, positiveTagList, platformName,
  } = vendor;

  const getNormalVendorLabel = getVendorLabel(tokenType.ColorType.BlueGray);

  const tagType = {
    0: {
      typeKey: 'normal',
      args: [tokenType.ColorType.BlueGray],
    },
    1: {
      typeKey: 'feature',
      args: [],
    },
    2: {
      typeKey: 'promotion',
      args: [null, false, 'primary'],
    },
  };

  const labels: labelList = {
    distance: [
      getNormalVendorLabel({
        text: `${pStoreRouteDesc}${isDiffLocation() ? `\n${rStoreRouteDesc}` : ''}`,
        iconContent: '\uee78',
      }),
    ],
  };

  if (platformName) {
    labels.provider = [
      getNormalVendorLabel({
        text: platformName,
      }),
    ];
  }

  positiveTagList.forEach((tag) => {
    const { type, title = 'Free Cancellation', icon: iconContent = '\uf2bf' } = tag;
    const params = tagType[type] || {};
    const getVendorLabelFn = getVendorLabel(...params.args);
    labels[params.typeKey] = labels[params.typeKey] || [];
    labels[params.typeKey].push(getVendorLabelFn({
      text: title,
      iconContent,
    }));
  });

  return labels;
};

const getVendorHeaderProps = (vendor) => {
  const {
    vendorLogo, vendorName, vendorTag = {}, commentInfo = {}, evaluation = {},
  } = vendor;
  const {
    commentCount, vendorDesc = 'test', overallRating = 'test', level = 'test',
  } = commentInfo;
  // 评分标签 type 1表示正向 蓝色  2负向 灰色
  const { type } = evaluation;
  return {
    vendorLogo,
    vendorName,
    title: vendorTag.title,
    scoreDesc: vendorDesc,
    commentDesc: `${commentCount} ${Reviews}`,
    score: level,
    totalScore: overallRating,
    scoreLow: type > 1,
  };
};

const getVendorItemData = (vendor) => {
  const {
    priceInfo, reference, privilegesPromotions, stockDesc,
  } = vendor;
  const priceDescProps = getPriceDescProps(priceInfo, privilegesPromotions);
  const vendorLabelItems = getVendorLabelItems(vendor);
  const soldOutLabel = getSoldOutLabel(stockDesc);
  const vendorHeaderProps = getVendorHeaderProps(vendor);
  return {
    priceDescProps,
    vendorLabelItems,
    // 国内资源才有库存
    soldOutLabel,
    vendorHeaderProps,
    reference,
  };
};

const getVendorListData = vendorPriceList => _.map(vendorPriceList, (vendor) => {
  const vendorItemData = getVendorItemData(vendor);
  return vendorItemData;
});

export const getVehicleListData = () => {
  const { productGroups, vehicleList } = getVehAndProductList();
  const groupListData = productGroups.map((group) => {
    const { productList } = group;
    const vehicleListData = productList.map((product, vehicleIndex) => {
      const { vehicleCode, vendorPriceList } = product;
      const vehicleItemData = getVehicleItemData(vehicleList, vehicleCode);
      const vendorListData = getVendorListData(vendorPriceList);
      return {
        vehicleIndex,
        ...vehicleItemData,
        data: [vendorListData],
      };
    });
    return vehicleListData;
  });
  return groupListData;
};

export const getGroupLength = () => {
  const vehGroupList = getVehGroupList();
  return {
    minIndex: 0,
    maxIndex: vehGroupList.length,
  };
};

export const getGroupNameByIndex = (index) => {
  const vehGroupList = getVehGroupList();
  return (vehGroupList[index] || {}).title;
};
