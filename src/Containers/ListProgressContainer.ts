import { connect } from 'react-redux';

import ListProgress from '../Pages/List/Components/ListProgress';
import { getAllVehicleCount, getAllVendorPriceCount } from '../Global/Cache/ListResSelectors';
import { getProgress } from '../State/ListStatus/Selectors';

const mapStateToProps = state => ({
  vehCount: getAllVehicleCount(),
  priceCount: getAllVendorPriceCount(),
  progress: getProgress(state),
});

export default connect(mapStateToProps)(ListProgress);
