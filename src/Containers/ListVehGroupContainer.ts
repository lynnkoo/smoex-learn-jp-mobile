import { connect } from 'react-redux';

import VehGroupNav from '../Pages/List/Components/VehGroupNav';
import { getActiveGroupId } from '../State/ListVehGroup/Selectors';
import { getVehGroupList } from '../Global/Cache/ListResSelectors';

const mapStateToProps = state => ({
  activeGroupId: getActiveGroupId(state),
  vehGroupList: getVehGroupList(),
});

/* eslint-disable no-unused-vars */
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(VehGroupNav);
