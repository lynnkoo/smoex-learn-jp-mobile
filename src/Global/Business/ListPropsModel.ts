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
export const getFilterBarProps = (pressCallback) => {
  const filterItemList = [];
  // 第一步 获取固定项-排序的状态
  const sort = {
    text: 'Sort', // todo - shark key
    isActive: false, // todo - 根据store中的值来判断
    hasFilter: false, // todo - 根据store中的值来判断
    onPress: () => { pressCallback('sort'); },
  };
  filterItemList.push(sort);
  // 第二步 获取服务端返回的热门项的状态
  const listRes = ListReqAndResData.getData(ListReqAndResData.keyList.listProductRes);
  const { popularFilterItems } = listRes;
  popularFilterItems.forEach((m) => {
    const item = {
      text: m.name,
      isActive: false, // todo - 根据store中的值来判断
      hasFilter: false, // todo - 根据store中的值来判断
      onPress: () => { pressCallback(m.code); },
    };
    filterItemList.push(item);
  });
  // 第三步 获取固定项-筛选的状态
  const filter = {
    text: 'Filter', // todo - shark key
    isActive: false, // todo - 根据store中的值来判断
    hasFilter: false, // todo - 根据store中的值来判断
    onPress: () => { pressCallback('filter'); },
  };
  filterItemList.push(filter);
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

// 获取时间选择组件所需参数
export const getDatePickerProps = () => {
  const state = getStore().getState();
  const { rentalDate } = state.LocationAndDate;
  return {
    ptime: rentalDate.pickUp.dateTime,
    rtime: rentalDate.dropOff.dateTime,
  };
};

// 获取搜索区域模块所需参数
export const getSearchPanelProps = () => {
  const state = getStore().getState();
  const { rentalLocation, rentalDate } = state.LocationAndDate;
  const { age } = state.DriverAge;
  const pCityInfo = {
    cityId: rentalLocation.pickUp.cityId,
    latitude: rentalLocation.pickUp.area.lat,
    longtitude: rentalLocation.pickUp.area.lng,
    locationCode: rentalLocation.pickUp.area.id,
    locationName: rentalLocation.pickUp.area.name,
    locationType: rentalLocation.pickUp.area.type,
  };
  const rCityInfo = {
    cityId: rentalLocation.dropOff.cityId,
    latitude: rentalLocation.dropOff.area.lat,
    longtitude: rentalLocation.dropOff.area.lng,
    locationCode: rentalLocation.dropOff.area.id,
    locationName: rentalLocation.dropOff.area.name,
    locationType: rentalLocation.dropOff.area.type,
  };
  return {
    ptime: rentalDate.pickUp.dateTime,
    rtime: rentalDate.dropOff.dateTime,
    pcity: pCityInfo,
    rcity: rCityInfo,
    age,
    showDropoff: rentalLocation.isOneWay,
  };
};

// 获取筛选和排序弹层所需参数
export const getFilterAndSortModalProps = () => {
  const listRes = ListReqAndResData.getData(ListReqAndResData.keyList.listProductRes) || {};
  const sortItems = (listRes.basicData && listRes.basicData.sortItems) || [];
  // const popularFilterItems = listRes.popularFilterItems || [];
  const filterData = [];
  const type = 'sort'; // todo  传点击的具体类型
  // switch (type) {
  //   case 'sort':
  //     sortItems.forEach((item) => {
  //       filterData.push({
  //         name: item.title,
  //         isSelected: false, // todo
  //       });
  //     });
  //     break;
  //   case 'Vendor_0':
  //     const curFilterItem = popularFilterItems.find((f) => f.code === 'Vendor_0');
  //     if(curFilterItem && curFilterItem.) {}
  //   default:
  //     break;
  // }
  sortItems.forEach((item) => {
    filterData.push({
      name: item.title,
      isSelected: false, // todo
    });
  });
  return {
    filterData,
    isShowFooter: false, // todo 根据类型来判断
    type,
  };
};
