import { connect } from 'react-redux';
import VehicleListWithControl from '../Pages/List/Components/VehicleListWithControl';
import { getActiveGroupIndex, getProgress } from '../State/List/Selectors';
import { setActiveGroupId } from '../State/List/Actions';
import { getVehicleListData, getGroupLength } from '../State/List/VehicleListMappers';


const mapStateToProps = (state) => {
  const { minIndex, maxIndex } = getGroupLength();
  const progress = getProgress(state);
  // console.log('【performance】mapStateToProps ', getActiveGroupIndex(state))
  return {
    index: getActiveGroupIndex(state),
    minIndex,
    maxIndex,
    progress,
    listData: getVehicleListData(progress),
  };
};

const mapDispatchToProps = dispatch => ({
  setActiveGroupId: (data) => { dispatch(setActiveGroupId(data)); },
});

export default connect(mapStateToProps, mapDispatchToProps)(VehicleListWithControl);
