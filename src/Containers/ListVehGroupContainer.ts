import { connect } from 'react-redux';

import VehGroupNav from '../Pages/List/Components/VehGroupNav';
import { getActiveGroupId } from '../State/ListVehGroup/Selectors';
import { getVehGroupList, getAllVehicleCount, getAllVendorPriceCount } from '../Global/Cache/ListResSelectors';
import { setActiveGroupId } from '../State/ListVehGroup/Actions';

const mapStateToProps = state => ({
  activeGroupId: getActiveGroupId(state),
  vehGroupList: getVehGroupList(),
  allVehicleCount: getAllVehicleCount(),
  allVendorPriceCount: getAllVendorPriceCount(),
});

/* eslint-disable no-unused-vars */
const mapDispatchToProps = dispatch => ({
  setActiveGroupId: (data) => { dispatch(setActiveGroupId(data)); },
});

export default connect(mapStateToProps, mapDispatchToProps)(VehGroupNav);
