import { connect } from 'react-redux';
import memoizeOne from 'memoize-one';
import _ from 'lodash';
import { FilterType } from '@ctrip/bbk-logic';
import { BbkUtils } from '@ctrip/bbk-utils';
import FilterAndSortModal from '../Pages/List/Components/FilterAndSortModal';
import { getActiveFilterBarCode, getSelectedFilters } from '../State/List/Selectors';
import { updateSelectedFilter, setActiveFilterBarCode } from '../State/List/Actions';
import {
  getAllVehicleCount,
  getAllVendorPriceCount,
  getPopularFilterItems,
  getFilterItems,
  getSortList,
  getFilterBarItemsCode,
} from '../Global/Cache/ListResSelectors';

const { selector } = BbkUtils;

const getPriceRange = memoizeOne(
  (filterItem) => {
    let priceRange = {
      minRange: 0,
      maxRange: 1000,
    };

    try {
      const minPriceDesc = filterItem[0].code;
      const maxPriceDesc = filterItem[filterItem.length - 1].code;
      const minPrice = parseInt(minPriceDesc.slice(minPriceDesc.indexOf('_') + 1, minPriceDesc.indexOf('-')), 10);
      const maxPrice = parseInt(maxPriceDesc.slice(maxPriceDesc.indexOf('-') + 1), 10);
      priceRange = {
        minRange: minPrice,
        maxRange: maxPrice,
      };
    } catch (e) {
      console.log(e);
    }

    return priceRange;
  },
);

const setFilterMenu = (filterMenuItem: any, selectedFilters: any) => {
  const filterMenus = [];

  if (filterMenuItem && filterMenuItem.length > 0) {
    filterMenuItem.forEach((menu, index) => {
      if (menu.filterGroups && menu.filterGroups.length > 0) {
        const filterGroups = [];

        menu.filterGroups.forEach((group) => {
          const filterItems = [];
          const priceIsSelected = selectedFilters.priceList && selectedFilters.priceList.length > 0;
          const isPriceGroup = group.groupCode === 'Price';

          if (group.filterItems && group.filterItems.length > 0) {
            group.filterItems.forEach((item) => {
              filterItems.push({
                name: item.name,
                code: item.itemCode,
                isSelected:
                  isPriceGroup && priceIsSelected
                    ? `${selectedFilters.priceList[0].min}-${selectedFilters.priceList[0].max}`
                      === item.code
                    : selectedFilters.codeList.includes(item.itemCode),
              });
            });
          }

          filterGroups.push(
            Object.assign(
              {
                name: group.name,
                code: group.groupCode,
                isSelected: selector(
                  isPriceGroup && priceIsSelected,
                  true,
                  filterItems.some(f => f.isSelected),
                ),
                filterItems,
              },
              {
                isShow: index < 2,
              },
              isPriceGroup ? {
                isSingleChoice: true,
                minRange: getPriceRange(filterItems).minRange,
                maxRange: getPriceRange(filterItems).maxRange,
                minPrice: getPriceRange(filterItems).minRange,
                maxPrice: getPriceRange(filterItems).maxRange,
              } : {
                isSingleChoice: false,
              },
              isPriceGroup && priceIsSelected
                ? {
                  minPrice: selectedFilters.priceList[0].min,
                  maxPrice: selectedFilters.priceList[0].max,
                }
                : {},
            ),
          );
        });

        filterMenus.push({
          name: menu.name,
          code: menu.code,
          isSelected: filterGroups.some(f => f.isSelected),
          filterGroups,
        });
      }
    });
  }
  return filterMenus;
};

// 获取当前用于展示的已筛选项
const getDisplaySelectedFiltersByType = (state, filterBarType) => {
  const selectedFilters: FilterType = getSelectedFilters(state) || {};
  const displaySelectedFilters = {
    codeList: [],
    priceList: [],
  };

  if (filterBarType === 'Sort') {
    displaySelectedFilters.codeList.push(selectedFilters.sortFilter);
  } else {
    displaySelectedFilters.codeList = displaySelectedFilters.codeList.concat(
      selectedFilters.bitsFilter,
    );
    displaySelectedFilters.priceList = selectedFilters.priceFilter;
  }

  return displaySelectedFilters;
};

const getFilterData = (state) => {
  const filterBarType = getActiveFilterBarCode(state);
  const displaySelectedFilters = getDisplaySelectedFiltersByType(state, filterBarType) || {
    codeList: [],
    priceList: [],
  };
  const sortItems = getSortList();
  const popularFilterItems = getPopularFilterItems();
  const allFilterItems = getFilterItems();

  let filterData = [];
  let isShowFooter = false;

  switch (filterBarType) {
    case 'Sort':
      sortItems.forEach((item) => {
        filterData.push({
          name: item.title,
          code: item.code,
          isSelected:
            displaySelectedFilters.codeList
            && displaySelectedFilters.codeList.length > 0
            && displaySelectedFilters.codeList.some((f: any) => f === item.code),
        });
      });
      isShowFooter = false;
      break;
    case 'Filter':
      filterData = setFilterMenu(allFilterItems, displaySelectedFilters);
      isShowFooter = true;
      break;
    default:
      filterData = setFilterMenu(
        popularFilterItems.filter(
          (f: any) => f.code === filterBarType
            || (filterBarType === 'Supplier' && f.code.indexOf('Vendor_') > -1),
        ), // 供应商筛选项code为Vendor_
        displaySelectedFilters,
      );
      isShowFooter = true;
      break;
  }
  return {
    filterData,
    isShowFooter,
    type: filterBarType,
    selectedFilters: _.cloneDeep(getSelectedFilters(state)),
    allFilters: getFilterBarItemsCode() || [],
  };
};

const mapStateToProps = state => ({
  ...getFilterData(state),
  allVehicleCount: getAllVehicleCount(),
  allVendorPriceCount: getAllVendorPriceCount(),
});

/* eslint-disable no-unused-vars */
const mapDispatchToProps = dispatch => ({
  updateSelectedFilter: data => dispatch(updateSelectedFilter(data)),
  setActiveFilterBarCode: data => dispatch(setActiveFilterBarCode(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterAndSortModal);
