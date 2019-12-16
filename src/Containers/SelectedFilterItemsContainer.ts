import { connect } from 'react-redux';
import SelectedFilterItems from '../Pages/List/Components/SelectedFilterItems';

const mapStateToProps = () => ({
  filters: [
    {
      id: 0,
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
