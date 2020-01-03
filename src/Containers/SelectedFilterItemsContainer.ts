import { connect } from 'react-redux';
import { getSharkValue } from '@ctrip/bbk-shark';
import { BbkUtils } from '@ctrip/bbk-utils';
import { getSelectedFilters } from '../State/List/Selectors';
import { deleteSelectedFilter, clearSelectedFilter } from '../State/List/Actions';
import SelectedFilterItems from '../Pages/List/Components/SelectedFilterItems';

const clearAllId = 'clearAll';

const mapStateToProps = (state) => {
  const { filterLabels = [] } = getSelectedFilters(state);
  const filters = BbkUtils.cloneDeep(filterLabels);
  const clearAllItem = {
    code: clearAllId,
    name: getSharkValue('list_clearAll'),
  };
  if (filters.length > 1) {
    filters.unshift(clearAllItem);
  }
  return {
    filters,
  };
};

const mapDispatchToProps = dispatch => ({
  clearFilter: (code) => {
    if (code === clearAllId) {
      dispatch(clearSelectedFilter());
    } else {
      dispatch(deleteSelectedFilter({
        deleteCode: code,
      }));
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectedFilterItems);
