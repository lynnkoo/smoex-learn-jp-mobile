import moment from 'moment';
import { getStore } from '../../State/Store';
import { AppContext } from '../../Util/Index';
import { ListReqAndResData } from '../Cache/Index';

// 列表页头部组件所需参数
export const getListHeaderProps = () => {
  const state = getStore().getState();
  const { rentalLocation, rentalDate } = state.LocationAndDate;
  const data = {
    ptime: moment(rentalDate.pickUp.dateTime).format('YYYY-MM-DD HH:mm:ss'),
    rtime: moment(rentalDate.dropOff.dateTime).format('YYYY-MM-DD HH:mm:ss'),
    pickupLocation: {
      locationType: Number(rentalLocation.pickUp.area.type),
      cityId: Number(rentalLocation.pickUp.cid),
      locationCode: rentalLocation.pickUp.area.id,
      locationName: rentalLocation.pickUp.area.name,
      poi: {
        longitude: parseFloat(rentalLocation.pickUp.area.lat || 0),
        latitude: parseFloat(rentalLocation.pickUp.area.lng || 0),
        radius: 0.0,
      },
    },
    returnLocation: {
      locationType: Number(rentalLocation.dropOff.area.type),
      cityId: Number(rentalLocation.dropOff.cid),
      locationCode: rentalLocation.dropOff.area.id,
      locationName: rentalLocation.dropOff.area.name,
      poi: {
        longitude: parseFloat(rentalLocation.dropOff.area.lat || 0),
        latitude: parseFloat(rentalLocation.dropOff.area.lng || 0),
        radius: 0.0,
      },
    },
  };

  return {
    enableChange: true,
    data,
    currency: AppContext.LanguageInfo.currency,
  };
};

// 热门筛选项组件所需参数
export const getFilterBarProps = () => {
  // todo
  const filterItemList = [{
    text: 'Sort',
    isActive: false,
    hasFilter: false,
  }, {
    text: 'Vendor',
    isActive: false,
    hasFilter: false,
  }, {
    text: 'Seats',
    isActive: false,
    hasFilter: false,
  }, {
    text: 'Filter',
    isActive: false,
    hasFilter: false,
  }];
  return {
    items: filterItemList,
  };
};

// 获取车型组组件所需参数
export const getVehNavProps = (pageId) => {
  const listRes = ListReqAndResData.getData(ListReqAndResData.keyList.listProductRes);
  const vehGroupList = [{
    gId: 'all',
    title: 'All Cars', // todo 需要根据shark key
  }];
  listRes.productGroups.forEach((m) => {
    vehGroupList.push({
      gId: m.groupCode,
      title: m.groupName,
    });
  });
  return {
    pageId,
    activeGroupId: '', // todo 从reducer中获取
    vehGroupList,
  };
};
