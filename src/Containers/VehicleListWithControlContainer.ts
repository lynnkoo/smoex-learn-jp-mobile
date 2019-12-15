import { connect } from 'react-redux';

import VehicleListWithControl from '../Pages/List/Components/VehicleListWithControl';
import { getActiveGroupIndex } from '../State/List/Selectors';
import { setActiveGroupId } from '../State/List/Actions';
import { getVehicleListData, getGroupLength } from '../State/List/VehicleListMappers';


const mapStateToProps = (state) => {
  const { minIndex, maxIndex } = getGroupLength();
  return {
    initIndex: getActiveGroupIndex(state),
    minIndex,
    maxIndex,
    listData: getVehicleListData(),
  };
};

const mapDispatchToProps = dispatch => ({
  setActiveGroupId: (data) => { dispatch(setActiveGroupId(data)); },
});

export default connect(mapStateToProps, mapDispatchToProps)(VehicleListWithControl);
