import { connect } from 'react-redux';
import BbkFilterBar from '@ctrip/bbk-component-car-filter-bar';
import { getActiveFilterBarCode, getSelectedFilters } from '../State/List/Selectors';
import { getPopularFilterItems } from '../Global/Cache/ListResSelectors';

const getFilterBarData = (state) => {
  const filterItemList = [];
  const selectedFilters = getSelectedFilters(state) || {};
  // 第一步 获取固定项-排序的状态
  const sort = {
    text: 'Sort', // todo - shark key
    isActive: getActiveFilterBarCode(state) === 'Sort',
    hasFilter: selectedFilters.Sort && selectedFilters.Sort.some(f => f.isSelected),
  };
  filterItemList.push(sort);
  // 第二步 获取服务端返回的热门项的状态
  const popularFilterItems = getPopularFilterItems();
  popularFilterItems.forEach((m) => {
    const item = {
      text: m.name,
      isActive: getActiveFilterBarCode(state) === m.name,
      hasFilter: selectedFilters[m.name] && selectedFilters[m.name].some(f => f.isSelected),
    };
    filterItemList.push(item);
  });
  // 第三步 获取固定项-筛选的状态
  const filter = {
    text: 'Filter', // todo - shark key
    isActive: getActiveFilterBarCode(state) === 'Filter',
    hasFilter: selectedFilters.Filter && selectedFilters.Filter.some(f => f.isSelected),
  };
  filterItemList.push(filter);

  return filterItemList;
};

const mapStateToProps = state => ({
  items: getFilterBarData(state),
});

/* eslint-disable no-unused-vars */
const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(BbkFilterBar);
