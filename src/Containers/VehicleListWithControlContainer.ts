import { connect } from 'react-redux';
import _ from 'lodash';
import VehicleListWithControl from '../Pages/List/Components/VehicleListWithControl';
import { getActiveGroupIndex, getProgress, getSelectedFilters } from '../State/List/Selectors';
import { setActiveGroupId } from '../State/List/Actions';
import { getVehicleListData, getGroupLength, getLastNextIndexObj } from '../State/List/VehicleListMappers';


const mapStateToProps = (state) => {
  const { minIndex, maxIndex } = getGroupLength();
  const progress = getProgress(state);
  const selectedFilters = getSelectedFilters(state);
  const listData = getVehicleListData(progress, _.cloneDeep(selectedFilters));
  const lastNextIndexObj = getLastNextIndexObj(minIndex, maxIndex, _.cloneDeep(selectedFilters));
  // console.log('【performance】mapStateToProps ', getActiveGroupIndex(state))
  return {
    index: getActiveGroupIndex(state),
    minIndex,
    maxIndex,
    progress,
    listData,
    lastNextIndexObj,
  };
};

const mapDispatchToProps = dispatch => ({
  setActiveGroupId: (data) => { dispatch(setActiveGroupId(data)); },
});

export default connect(mapStateToProps, mapDispatchToProps)(VehicleListWithControl);
