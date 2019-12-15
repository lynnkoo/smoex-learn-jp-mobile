import { connect } from 'react-redux';
import FilterAndSortModal from '../Pages/List/Components/FilterAndSortModal';
import { getActiveFilterBarCode, getSelectedFilters } from '../State/List/Selectors';
import { getAllVehicleCount, getAllVendorPriceCount } from '../Global/Cache/ListResSelectors'

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
  const sortItems = [];
  const popularFilterItems = [];
  const allFilterItems = [];

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
    case 'Vendor_0':
      filterData = setFilterGroup(
        popularFilterItems.find((f: any) => f.code === 'Vendor_0'),
        selectedFilters,
      );
      isShowFooter = true;
      break;
    case 'Seats':
      filterData = setFilterGroup(
        popularFilterItems.find((f: any) => f.code === 'Seats'),
        selectedFilters,
      );
      isShowFooter = false;
      break;
    case 'All':
      filterData = setFilterGroup(allFilterItems, selectedFilters);
      isShowFooter = true;
      break;
    default:
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
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(FilterAndSortModal);
