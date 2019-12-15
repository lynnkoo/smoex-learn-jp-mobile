import { connect } from 'react-redux';
import FilterAndSortModal from '../Pages/List/Components/FilterAndSortModal';
import { getActiveFilterBarCode, getSelectedFilters } from '../State/List/Selectors';
import {
  getAllVehicleCount,
  getAllVendorPriceCount,
  getPopularFilterItems,
  getFilterItems,
  getSortList,
} from '../Global/Cache/ListResSelectors';

const setFilterGroup = (filterMenuItem: any, selectedFilters: any) => {
  const filterGroup = [];

  if (filterMenuItem && filterMenuItem.filterGroups && filterMenuItem.filterGroups.length > 0) {
    filterMenuItem.filterGroups.forEach((group) => {
      const filterItems = [];
      const groupIsSelected = selectedFilters.some((f: any) => f.code === group.groupCode);
      const selectedFilterItems = selectedFilters.find((f: any) => f.code === group.groupCode);

      if (group.filterItems && group.filterItems.length > 0) {
        group.filterItems.forEach((item) => {
          filterItems.push({
            name: item.name,
            code: item.itemCode,
            sortNum: item.sortName,
            isSelected:
              groupIsSelected && selectedFilterItems.some((f: any) => f.code === item.groupCode),
          });
        });
      }

      filterGroup.push({
        name: group.name,
        code: group.groupCode,
        sortNum: group.sortName,
        isSelected: groupIsSelected,
        filterItems,
      });
    });
  }
  return filterGroup;
};

const getFilterData = (state) => {
  const type = getActiveFilterBarCode(state);
  const selectedFilters = getSelectedFilters(state)[type] || [];
  const sortItems = getSortList();
  const popularFilterItems = getPopularFilterItems();
  const allFilterItems = getFilterItems();

  let filterData = [];
  let isShowFooter = false;

  switch (type) {
    case 'Sort':
      sortItems.forEach((item) => {
        filterData.push({
          name: item.title,
          code: item.code,
          sortNum: item.sortName,
          isSelected: selectedFilters.some((f: any) => f.code === item.code),
        });
      });
      isShowFooter = false;
      break;
    case 'Filter':
      filterData = setFilterGroup(allFilterItems, selectedFilters);
      isShowFooter = true;
      break;
    default:
      filterData = setFilterGroup(
        popularFilterItems.find((f: any) => f.code === type),
        selectedFilters,
      );
      isShowFooter = true;
      break;
  }
  return {
    filterData,
    isShowFooter,
    type,
  };
};

const mapStateToProps = state => ({
  ...getFilterData(state),
  allVehicleCount: getAllVehicleCount(),
  allVendorPriceCount: getAllVendorPriceCount(),
});

/* eslint-disable no-unused-vars */
const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(FilterAndSortModal);
