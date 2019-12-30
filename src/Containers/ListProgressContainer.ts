import { connect } from 'react-redux';

import ListProgress from '../Pages/List/Components/ListProgress';
import { getAllVehicleCount, getAllVendorPriceCount } from '../Global/Cache/ListResSelectors';
import { getProgress } from '../State/List/Selectors';
import { setProgressIsFinish } from '../State/List/Actions';

const mapStateToProps = state => ({
  vehCount: getAllVehicleCount(),
  priceCount: getAllVendorPriceCount(),
  progress: getProgress(state),
});

const mapDispatchToProps = dispatch => ({
  setProgressIsFinish: data => dispatch(setProgressIsFinish(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ListProgress);
