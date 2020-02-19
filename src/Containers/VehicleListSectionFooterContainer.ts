import { connect } from 'react-redux';
import { getScrollViewHeight } from '../State/List/Selectors';
import SectionFooter from '../Pages/List/Components/VehicleListSectionFooter';
import { fetchListBatchQuery } from '../State/List/Actions';


const mapStateToProps = state => ({
  scrollViewHeight: getScrollViewHeight(state),
});

const mapDispatchToProps = {
  fetchListBatchQuery,
};

export default connect(mapStateToProps, mapDispatchToProps)(SectionFooter);
