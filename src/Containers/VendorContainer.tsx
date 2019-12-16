import { connect } from 'react-redux';
import Vendor from '../Pages/List/Components/Vendor';
import { getFormatLocationAndDate } from '../State/LocationAndDate/Selectors';

const mapStateToProps = state => ({
  locationAndDate: getFormatLocationAndDate(state),
});

const mapDispatchToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Vendor);
