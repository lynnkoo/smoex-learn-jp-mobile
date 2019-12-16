import { getProductGroups } from '@ctrip/bbk-logic';
import { allCars } from '../../Pages/List/Texts';

// 对列表页响应数据的一系列选择操作方法
import ListReqAndResData from './ListReqAndResData';

export const getBaseResData = () => ListReqAndResData.getData(ListReqAndResData.keyList.listProductRes) || {};

// 获取服务端返回的基础的车型组报价数据
export const getBaseProductGroups = () => getBaseResData().productGroups || [];

// 获取所有车型组下的报价数据(包含全部车型)
// todo 需调排序的
export const getAllProductGroups = () => getProductGroups(getBaseProductGroups(), {
  groupCode: 'all',
  groupName: allCars,
});

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

// 获取所有筛选项列表
export const getAllFilterMenuItems = () => getBaseResData().filterMenuItems || [];

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
