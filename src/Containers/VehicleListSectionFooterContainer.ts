import { connect } from 'react-redux';
import { getScrollViewHeight } from '../State/List/Selectors';
import SectionFooter from '../Pages/List/Components/VehicleListSectionFooter';


const mapStateToProps = state => ({
  scrollViewHeight: getScrollViewHeight(state),
});

const mapDispatchToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(SectionFooter);
