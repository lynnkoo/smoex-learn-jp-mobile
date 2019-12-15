import { getStore } from '../../State/Store';
import { ListReqAndResData } from '../Cache/Index';

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
  const listRes = ListReqAndResData.getData(ListReqAndResData.keyList.listProductRes) || {};
  const { popularFilterItems = [] } = listRes;
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


// 获取搜索区域模块所需参数
export const getSearchPanelProps = () => {
  const state = getStore().getState();
  const { rentalLocation, rentalDate } = state.LocationAndDate;
  const { age } = state.DriverAgeAndNumber;
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
