import { connect } from 'react-redux';
import _ from 'lodash';
import VehicleListWithControl from '../Pages/List/Components/VehicleListWithControl';
import { getActiveGroupIndex, getProgress, getSelectedFilters } from '../State/List/Selectors';
import { setActiveGroupId } from '../State/List/Actions';
import { getVehicleListData, getGroupLength } from '../State/List/VehicleListMappers';


const mapStateToProps = (state) => {
  const { minIndex, maxIndex } = getGroupLength();
  const progress = getProgress(state);
  const selectedFilters = getSelectedFilters(state);
  // console.log('【performance】mapStateToProps ', getActiveGroupIndex(state))
  return {
    index: getActiveGroupIndex(state),
    minIndex,
    maxIndex,
    progress,
    listData: getVehicleListData(progress, _.cloneDeep(selectedFilters)),
  };
};

const mapDispatchToProps = dispatch => ({
  setActiveGroupId: (data) => { dispatch(setActiveGroupId(data)); },
});

export default connect(mapStateToProps, mapDispatchToProps)(VehicleListWithControl);
