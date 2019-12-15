import { connect } from 'react-redux';
import Vendor from '../Pages/List/Components/Vendor';
import { getLocationAndDate } from '../State/LocationAndDate/Selectors';

const mapStateToProps = state => ({
  locationAndDate: getLocationAndDate(state),
});

const mapDispatchToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Vendor);
