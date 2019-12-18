import { connect } from 'react-redux';
import BbkFilterBar from '@ctrip/bbk-component-car-filter-bar';
import { getActiveFilterBarCode } from '../State/List/Selectors';
import { getPopularFilterItems } from '../Global/Cache/ListResSelectors';

// const getPopularFiltersHasFilter = (name) => {
//   const codeList = getFilterBarItemsCode().popularFilterList.map(item => item.name === name);

//   console.log(codeList);
// };

const getFilterBarData = (state) => {
  const filterItemList = [];

  // 第一步 获取固定项-排序的状态
  const sort = {
    text: 'Sort', // todo - shark key
    isActive: getActiveFilterBarCode(state) === 'Sort',
    hasFilter: false,
  };
  filterItemList.push(sort);
  // 第二步 获取服务端返回的热门项的状态
  const popularFilterItems = getPopularFilterItems();
  popularFilterItems.forEach((m) => {
    const item = {
      text: m.name,
      isActive: getActiveFilterBarCode(state) === m.name,
      hasFilter: false,
    };
    filterItemList.push(item);
  });
  // 第三步 获取固定项-筛选的状态
  const filter = {
    text: 'Filter', // todo - shark key
    isActive: getActiveFilterBarCode(state) === 'Filter',
    hasFilter: false,
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
