// 对列表页响应数据的一系列选择操作方法
import ListReqAndResData from './ListReqAndResData';

export const getBaseResData = () => ListReqAndResData.getData(ListReqAndResData.keyList.listProductRes) || {};

// 获取所有车型组下的报价数据
export const getProductGroups = () => getBaseResData().productGroups || [];

// 获取所有车型详情数据列表
export const getVehicleList = () => getBaseResData().vehicleList || [];

// 获取所有车型详情列表和报价列表
export const getVehAndProductList = () => ({ vehicleList: getVehicleList(), productGroups: getProductGroups() });

// 获取车型组列表数据
export const getVehGroupList = () => {
  const vehGroupList = []; // todo 全部车型

  getProductGroups().forEach((item) => {
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
