import _ from 'lodash';
import {
  tokenType,
  icon,
} from '@ctrip/bbk-tokens';
import memoizeOne from 'memoize-one';
import { BbkUtils } from '@ctrip/bbk-utils';
import { getSharkValue } from '@ctrip/bbk-shark';
import { Utils } from '../../Util/Index';
import {
  listDay, Reviews, total,
} from '../../Pages/List/Texts';
import { VehicleListStyle as style } from '../../Pages/List/Styles';
import {
  getVehAndProductList, getVehGroupList, isDiffLocation,
} from '../../Global/Cache/ListResSelectors';

const { getPixel, htmlDecode } = BbkUtils;
let count = 0;

const getVehicleItemData = (vehicleList, vehicleCode) => {
  const vehicle = _.find(vehicleList, {
    vehicleCode,
  }) || {};
  const {
    name,
    groupName,
    isHot,
    // brandEName,
    passengerNo,
    luggageNo,
    doorNo,
    hasConditioner,
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
    // 没有空调时不出
    hasConditioner && conditionerDesc && {
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
      vehicleName: name,
      groupName,
      isSimilar: !isSpecialized,
      isHotLabel: isHot,
    },
    vehicleDesc: {
      imgUrl: Utils.fullImgProtocal(imageList[0]),
      // 只有国内有牌照，一期无此字段
      // vehicleImageLabel: brandEName,
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
    count,
  };
};

const getPriceDescProps = (priceInfo, privilegesPromotions = {}) => {
  const {
    currentOriginalDailyPrice, currentTotalPrice, currentCurrencyCode = '', currentDailyPrice,
  } = priceInfo;
  const { title }: any = privilegesPromotions;
  if (!currentTotalPrice) {
    return null;
  }
  // 国内资源可能没有天价，因为异地还车费不确定
  const res = {
    totalPrice: {
      price: currentTotalPrice,
      currency: currentCurrencyCode,
    },
    totolText: total,
    // todo: 没有日价时需要取总价
    // totolText: days(7),
    dayText: `/${listDay}`,
    [title && 'saleLabel']: title,
  };

  if (currentOriginalDailyPrice) {
    res.originPrice = {
      // todo: 没有日价时需要取总价
      price: currentOriginalDailyPrice,
      currency: currentCurrencyCode,
    };
  }
  if (currentDailyPrice) {
    res.dayPrice = {
      price: currentDailyPrice,
      currency: currentCurrencyCode,
    };
  }
  return res;
};

const getVendorLabel = (
  colorType?: string, noBg: boolean = true, iconType?: string,
) => ({ text, iconContent }: { text: string, iconContent?: string }) => ({
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
  iconContent: htmlDecode(icon.circleWithSighFilled),
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
    pStoreRouteDesc, rStoreRouteDesc, allTags = [], platformName,
  } = vendor;

  const getNormalVendorLabel = getVendorLabel(tokenType.ColorType.BlueGray);

  // 1：正向，2：负向，3：营销
  const tagType = {
    1: {
      typeKey: 'feature',
      args: [],
    },
    2: {
      typeKey: 'normal',
      args: [tokenType.ColorType.BlueGray],
    },
    3: {
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
        text: getSharkValue('list_serviceProvidedBy', platformName),
      }),
    ];
  }

  allTags.forEach((tag) => {
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
    commentCount, level, overallRating, maximumRating,
  } = commentInfo;
  // 评分标签 type 1表示正向 蓝色  2负向 灰色
  const { type } = evaluation;
  return {
    vendorLogo,
    vendorName,
    title: vendorTag.title,
    scoreDesc: level,
    commentDesc: `${commentCount} ${Reviews}`,
    score: overallRating,
    totalScore: maximumRating,
    scoreLow: type > 1,
  };
};

const getVendorItemData = (vendor, vendorIndex) => {
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
    vendorIndex,
  };
};

const getVendorListData = (
  vendorPriceList, vehicleIndex,
) => _.map(vendorPriceList, (vendor, vendorIndex) => {
  const vendorItemData = getVendorItemData(vendor, `${vehicleIndex}-${vendorIndex}`);
  return vendorItemData;
});

export const getVehicleListData = memoizeOne(
  // eslint-disable-next-line
  (progress, selectedFilters) => {
    // console.log('【performance】getVehicleListData ---------- ', progress)
    count = 0;
    const { productGroups, vehicleList } = getVehAndProductList();
    const groupListData = productGroups.map((group) => {
      const { productList } = group;
      const vehicleListData = productList.map((product, vehicleIndex) => {
        const { vehicleCode, vendorPriceList } = product;
        const vehicleItemData = getVehicleItemData(vehicleList, vehicleCode);
        const vendorListData = getVendorListData(vendorPriceList, vehicleIndex);
        return {
          vehicleIndex,
          ...vehicleItemData,
          data: [vendorListData],
        };
      });
      return vehicleListData;
    });
    return groupListData;
  },
  (newArgs, oldArgs) => _.isEqual(oldArgs, newArgs),
);

const getEnabledIndex = (index, maxIndex, minIndex, step) => {
  const vehGroupList = getVehGroupList();
  let nextIndex = index;
  do {
    if (step > 0) {
      nextIndex = Math.min(nextIndex + step, maxIndex + 1);
    } else {
      nextIndex = Math.max(nextIndex + step, minIndex - 1);
    }
  } while (
    nextIndex <= maxIndex
    && nextIndex >= minIndex
    && vehGroupList[nextIndex].count === 0
  );

  return nextIndex;
};

/**
 * 获取筛选后每个车型对应的可用上个车型和下个车型
 */
export const getLastNextIndexObj = memoizeOne(
  // eslint-disable-next-line
  (minIndex, maxIndex, selectedFilters) => {
    const res = {};
    for (let i = minIndex; i <= maxIndex - minIndex + 1; i += 1) {
      res[i] = {
        last: getEnabledIndex(i, maxIndex, minIndex, -1),
        next: getEnabledIndex(i, maxIndex, minIndex, 1),
      };
    }
    return res;
  },
  (newArgs, oldArgs) => _.isEqual(oldArgs, newArgs),
);

export const getGroupLength = () => {
  const vehGroupList = getVehGroupList();
  return {
    minIndex: 0,
    maxIndex: vehGroupList.length - 1,
  };
};

export const getGroupNameByIndex = (index) => {
  const vehGroupList = getVehGroupList();
  return (vehGroupList[index] || {}).title;
};
