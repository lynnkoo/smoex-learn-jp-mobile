import { getProductGroupsAndCount } from '@ctrip/bbk-logic';
import { FrontEndConfig } from '../../Constants/Index';
// import { getStore } from '../../State/Store';

// 对列表页响应数据的一系列选择操作方法
import ListReqAndResData from './ListReqAndResData';

export const getBaseResData = () => ListReqAndResData.getData(ListReqAndResData.keyList.listProductRes) || {};

// 获取服务端返回的基础的车型组报价数据
export const getBaseProductGroups = () => getBaseResData().productGroups || [];

// 获取所有筛选项列表
export const getAllFilterMenuItems = () => getBaseResData().filterMenuItems || [];

// 获取筛选后的所有车型组下的报价数据(包含全部车型)
export const getAllProductGroupsAndCount = () => {
  // todo
  // const state = getStore().getState();
  // const filterResult = getProductGroupsAndCount(getBaseProductGroups(), FrontEndConfig.AllCarsConfig, getAllFilterMenuItems(), state.List.selectedFilters);
  // @ts-ignore
  const filterResult = getProductGroupsAndCount(getBaseProductGroups(), FrontEndConfig.AllCarsConfig);
  return filterResult;
};

export const getAllProductGroups = () => getAllProductGroupsAndCount().productGroups;

export const getRequestInfo = () => getBaseResData().requestInfo || {};

// 获取所有车型详情数据列表
export const getVehicleList = () => getBaseResData().vehicleList || [];

// 获取所有车型详情列表和报价列表
export const getVehAndProductList = () => ({ vehicleList: getVehicleList(), productGroups: getAllProductGroups() });

// 获取车型组列表数据
export const getVehGroupList = () => {
  const vehGroupList = [];
  getAllProductGroups().forEach((item) => {
    vehGroupList.push({
      gId: item.groupCode,
      title: item.groupName,
    });
  });

  return vehGroupList;
};

// 获取所有车型个数
export const getAllVehicleCount = () => getBaseResData().allVehicleCount || 0;

// 获取所有报价个数
export const getAllVendorPriceCount = () => getBaseResData().allVendorPriceCount || 0;

const getFilterItemsByHierarchy = (hierarchy: number) => {
  const targetList = [];
  getAllFilterMenuItems().forEach((item) => {
    if (item.hierarchy === hierarchy) {
      targetList.push(item);
    }
  });
  return targetList;
};

// 获取热门筛选项列表
export const getPopularFilterItems = () => getFilterItemsByHierarchy(1);

// 获取点击'Filter'后对应的所有筛选项列表
export const getFilterItems = () => getFilterItemsByHierarchy(2);

// 获取排序列表
export const getSortList = () => {
  const { basicData } = getBaseResData();
  return (basicData && basicData.sortItems) || [];
};

export const getRecommendInfo = () => getBaseResData().recommendInfo || {};

// 是否为异地取还
export const isDiffLocation = () => getRequestInfo().pickupLocationName !== getRequestInfo().returnLocationName;

// 遍历筛选code
const mapCode = (filterMenu, result) => {
  if (filterMenu.filterGroups && filterMenu.filterGroups.length > 0) {
    filterMenu.filterGroups.forEach((group) => {
      if (group.filterItems && group.filterItems.length > 0) {
        group.filterItems.forEach((filter) => {
          result.push(filter.itemCode);
        });
      }
    });
  }

  return result;
};

// 获取filterbar上每个选项所含有的筛选项的全部code
export const getFilterBarItemsCode = () => {
  const popularFilterList = getPopularFilterItems().map(item => ({
    type: item.code.indexOf('Vendor_') > -1 ? 'Supplier' : item.code,
    codeList: mapCode(item, []),
  })) || [];

  let filterList = [];

  getFilterItems().forEach((item) => {
    filterList = filterList.concat(mapCode(item, []));
  });

  popularFilterList.push({
    type: 'Filter',
    codeList: filterList,
  });

  return popularFilterList;
};
