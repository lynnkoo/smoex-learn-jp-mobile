import { connect } from 'react-redux';

import VehGroupNav from '../Pages/List/Components/VehGroupNav';
import { getActiveGroupId, getProgress } from '../State/List/Selectors';
import {
  getVehGroupList, getAllVehicleCount, getAllVendorPriceCount, getAllProductGroups,
} from '../Global/Cache/ListResSelectors';
import { setActiveGroupId } from '../State/List/Actions';

const mapStateToProps = state => ({
  progress: getProgress(state),
  activeGroupId: getActiveGroupId(state),
  vehGroupList: getVehGroupList(getAllProductGroups()),
  allVehicleCount: getAllVehicleCount(),
  allVendorPriceCount: getAllVendorPriceCount(),
});

/* eslint-disable no-unused-vars */
const mapDispatchToProps = dispatch => ({
  setActiveGroupId: (data) => { dispatch(setActiveGroupId(data)); },
});

export default connect(mapStateToProps, mapDispatchToProps)(VehGroupNav);
