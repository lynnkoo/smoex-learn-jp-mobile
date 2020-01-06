import { connect } from 'react-redux';
import { BbkUtils } from '@ctrip/bbk-utils';
import VehicleListWithControl from '../Pages/List/Components/VehicleListWithControl';
import {
  getActiveGroupIndex, getProgress, getSelectedFilters, getScrollViewHeight,
} from '../State/List/Selectors';
import { setActiveGroupId } from '../State/List/Actions';
import {
  getVehicleListData, getGroupLength, getLastNextIndexObj,
} from '../State/List/VehicleListMappers';


const mapStateToProps = (state) => {
  const { minIndex, maxIndex } = getGroupLength();
  const progress = getProgress(state);
  const selectedFilters = getSelectedFilters(state);
  const listData = getVehicleListData(progress, BbkUtils.cloneDeep(selectedFilters));
  const lastNextIndexObj = getLastNextIndexObj(
    minIndex, maxIndex, BbkUtils.cloneDeep(selectedFilters),
  );
  // console.log('【performance】mapStateToProps ', getActiveGroupIndex(state))
  return {
    index: getActiveGroupIndex(state),
    minIndex,
    maxIndex,
    progress,
    listData,
    lastNextIndexObj,
    scrollViewHeight: getScrollViewHeight(state),
  };
};

const mapDispatchToProps = dispatch => ({
  setActiveGroupId: (data) => { dispatch(setActiveGroupId(data)); },
});

export default connect(mapStateToProps, mapDispatchToProps)(VehicleListWithControl);
