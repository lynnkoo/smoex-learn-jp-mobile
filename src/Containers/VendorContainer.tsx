import { connect } from 'react-redux';
import Vendor from '../Pages/List/Components/Vendor';
import { getFormatLocationAndDate } from '../State/LocationAndDate/Selectors';
import { getAge } from '../State/DriverAgeAndNumber/Selectors';

const mapStateToProps = state => ({
  locationAndDate: getFormatLocationAndDate(state),
  age: getAge(state),
});

const mapDispatchToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Vendor);
