import { connect } from 'react-redux';
import _ from 'lodash';
import { getSharkValue } from '@ctrip/bbk-shark';
import { getSelectedFilters } from '../State/List/Selectors';
import { deleteSelectedFilter, clearSelectedFilter } from '../State/List/Actions';
import SelectedFilterItems from '../Pages/List/Components/SelectedFilterItems';

const clearAllId = 'clearAll';

const priceMapper = {
  min: '>=',
  max: '<=',
  '>=': 'min',
  '<=': 'max',
};

const mapStateToProps = (state) => {
  const { priceFilter = [], bitsFilter = [] } = getSelectedFilters(state);
  // todo: test
  const filters = bitsFilter.map(item => ({
    id: item,
    text: item,
  }));
  const priceObj = priceFilter[0] || {};
  if (priceObj.min && priceObj.max) {
    const priceFilterItem = [];
    _.keys(priceObj).forEach((k) => {
      priceFilterItem.push(priceObj[k]);
    });
    filters.push({
      id: priceFilterItem.join('~'),
      text: priceFilterItem.join('~'),
    });
  } else {
    _.keys(priceObj).forEach((k) => {
      filters.push({
        id: priceMapper[k] + priceObj[k],
        text: priceMapper[k] + priceObj[k],
      });
    });
  }

  const clearAllItem = {
    id: clearAllId,
    text: getSharkValue('list_clearAll'),
  };
  if (filters.length > 1) {
    filters.unshift(clearAllItem);
  }
  return {
    filters,
  };
};

const mapDispatchToProps = dispatch => ({
  clearFilter: (id) => {
    if (id === clearAllId) {
      dispatch(clearSelectedFilter());
    } else {
      dispatch(deleteSelectedFilter({
        deleteCode: id,
      }));
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectedFilterItems);
