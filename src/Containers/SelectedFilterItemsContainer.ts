import { connect } from 'react-redux';
import { getSharkValue } from '@ctrip/bbk-shark';
import SelectedFilterItems from '../Pages/List/Components/SelectedFilterItems';

const mapStateToProps = () => ({
  filters: [
    {
      id: 0,
      text: getSharkValue('list_clearAll'),
    },
    {
      id: 1,
      text: 'test filter',
    },
  ],
});

// todo
const mapDispatchToProps = () => ({
  clearFilter: (data) => {
    console.log('-------clearFilter', data);
    // dispatch(setActiveGroupId(data));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectedFilterItems);
