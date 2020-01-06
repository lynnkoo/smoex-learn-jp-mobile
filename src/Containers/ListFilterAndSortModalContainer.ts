import { connect } from 'react-redux';
import memoizeOne from 'memoize-one';
import _ from 'lodash';
import { FilterType } from '@ctrip/bbk-logic';
import { BbkUtils } from '@ctrip/bbk-utils';
import FilterAndSortModal from '../Pages/List/Components/FilterAndSortModal';
import {
  getActiveFilterBarCode,
  getSelectedFilters,
  getSortAndFilterVisible,
} from '../State/List/Selectors';
import {
  updateSelectedFilter,
  setActiveFilterBarCode,
  setFilterModalIsShow,
} from '../State/List/Actions';
import {
  getFilterCalculate,
  getPopularFilterItems,
  getFilterItems,
  getSortList,
  getFilterBarItemsCode,
} from '../Global/Cache/ListResSelectors';
import { AppContext } from '../Util/Index';

const { selector, cloneDeep } = BbkUtils;

const getPriceStep = memoizeOne(
  (currency) => {
    let priceStep = 50;

    switch (currency) {
      case 'JPY':
        priceStep = 1000;
        break;
      case 'KRW':
        priceStep = 10000;
        break;
      default:
        priceStep = 50;
        break;
    }

    return priceStep;
  },
);

const PRICE_STEP = getPriceStep(AppContext.LanguageInfo.currency); // 价格滑条滑动间隔

const getPriceRange = memoizeOne(
  (filterItem, priceStep) => {
    let priceRange = {
      minRange: 0,
      maxRange: 1000,
    };

    try {
      const minPriceDesc = filterItem[0].code;
      const maxPriceDesc = filterItem[filterItem.length - 1].code;
      const minPrice = parseInt(minPriceDesc.split('-')[0], 10);
      const tempMaxPrice = parseInt(maxPriceDesc.split('-')[1], 10);
      const maxPrice = _.ceil(tempMaxPrice, -(tempMaxPrice.toString().length - 1));
      priceRange = {
        minRange: minPrice,
        maxRange: maxPrice + priceStep,
      };
    } catch (e) {
      /* eslint-disable no-console */
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
              const code = isPriceGroup ? item.code : item.itemCode;
              filterItems.push({
                name: item.name,
                itemCode: item.itemCode,
                code,
                isSelected:
                  isPriceGroup && priceIsSelected
                    ? `${selectedFilters.priceList[0].min}-${selectedFilters.priceList[0].max}`
                    === item.code
                    : selectedFilters.codeList.includes(code),
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
                minRange: getPriceRange(filterItems, PRICE_STEP).minRange,
                maxRange: getPriceRange(filterItems, PRICE_STEP).maxRange,
                minPrice: getPriceRange(filterItems, PRICE_STEP).minRange,
                maxPrice: getPriceRange(filterItems, PRICE_STEP).maxRange,
              } : {
                isSingleChoice: false,
              },
              isPriceGroup && priceIsSelected
                ? {
                  minPrice: selectedFilters.priceList[0].min
                  || getPriceRange(filterItems, PRICE_STEP).minRange,
                  maxPrice: selectedFilters.priceList[0].max
                  || getPriceRange(filterItems, PRICE_STEP).maxRange,
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
      break;
    case 'Filters':
      filterData = setFilterMenu(allFilterItems, displaySelectedFilters);
      break;
    case '':
    case undefined:
      break;
    default:
      filterData = setFilterMenu(
        popularFilterItems.filter(
          (f: any) => f.code === filterBarType,
        ),
        displaySelectedFilters,
      );
      break;
  }

  const selectedFilters = cloneDeep(getSelectedFilters(state));

  return {
    filterData,
    type: filterBarType,
    selectedFilters,
    filterCalculater: getFilterCalculate(selectedFilters),
    allFilters: getFilterBarItemsCode() || [],
  };
};

const mapStateToProps = state => ({
  ...getFilterData(state),
  visible: getSortAndFilterVisible(state),
  priceStep: PRICE_STEP,
  currency: AppContext.LanguageInfo.currency,
});

/* eslint-disable no-unused-vars */
const mapDispatchToProps = dispatch => ({
  updateSelectedFilter: data => dispatch(updateSelectedFilter(data)),
  // updateTempSelectedFilter: data => dispatch(updateTempSelectedFilter(data)),
  setActiveFilterBarCode: data => dispatch(setActiveFilterBarCode(data)),
  setFilterModalIsShow: data => dispatch(setFilterModalIsShow(data)),
  getFilterCalculate: tempSelectedFilters => getFilterCalculate(tempSelectedFilters),
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterAndSortModal);
