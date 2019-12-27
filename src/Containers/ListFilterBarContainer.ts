import { connect } from 'react-redux';
import BbkFilterBar from '@ctrip/bbk-component-car-filter-bar';
import { getSharkValue } from '@ctrip/bbk-shark';
import { getActiveFilterBarCode, getSelectedFilters } from '../State/List/Selectors';
import { getPopularFilterItems, getFilterBarItemsCode } from '../Global/Cache/ListResSelectors';
import { setActiveFilterBarCode } from '../State/List/Actions';

const getFilterBarData = (state) => {
  const filterItemList = [];

  // 第一步 获取固定项-排序的状态
  const sort = {
    text: getSharkValue('sort'),
    code: 'Sort',
    isActive: getActiveFilterBarCode(state) === 'Sort',
    hasFilter: getSelectedFilters(state).sortFilter !== '1',
  };
  filterItemList.push(sort);
  // 第二步 获取服务端返回的热门项的状态
  const popularFilterItems = getPopularFilterItems();
  popularFilterItems.forEach((m) => {
    const codeItem = getFilterBarItemsCode().find(v => v.type === m.code);
    const item = {
      text: m.name,
      isActive: getActiveFilterBarCode(state) === m.code,
      code: m.code,
      hasFilter: codeItem
        && codeItem.codeList
        && codeItem.codeList.some(c => getSelectedFilters(state).bitsFilter.includes(c)),
    };
    filterItemList.push(item);
  });
  // 第三步 获取固定项-筛选的状态
  const filter = {
    text: getSharkValue('list_filters'),
    code: 'Filters',
    isActive: getActiveFilterBarCode(state) === 'Filters',
    hasFilter:
      getFilterBarItemsCode()
        .find(v => v.type === 'Filters')
        .codeList.some(c => getSelectedFilters(state).bitsFilter.includes(c))
      || getSelectedFilters(state).priceFilter.length > 0,
  };
  filterItemList.push(filter);

  return filterItemList;
};

const mapStateToProps = state => ({
  items: getFilterBarData(state),
});

/* eslint-disable no-unused-vars */
const mapDispatchToProps = dispatch => ({
  setActiveFilterBarCode: data => dispatch(setActiveFilterBarCode(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BbkFilterBar);