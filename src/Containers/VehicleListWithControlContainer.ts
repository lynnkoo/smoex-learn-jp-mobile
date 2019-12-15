import { connect } from 'react-redux';

import VehicleListWithControl from '../Pages/List/Components/VehicleListWithControl';
import { getActiveGroupIndex } from '../State/List/Selectors';
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

const mapDispatchToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(VehicleListWithControl);
