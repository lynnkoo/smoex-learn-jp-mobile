import { connect } from 'react-redux';
import { getScrollViewHeight } from '../State/List/Selectors';
import FilterNoMatch from '../Pages/List/Components/FilterNoMatch';


const mapStateToProps = state => ({
  scrollViewHeight: getScrollViewHeight(state),
});

const mapDispatchToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterNoMatch);
