import { connect } from 'react-redux';

import List from '../Pages/List/Index';
import {
  initActiveGroupId, getStatus, fetchListBatchQuery,
  setDatePickerIsShow, setLocationAndDatePopIsShow, setActiveFilterBarCode,
} from '../State/List/Actions';
import { setLocationInfo } from '../State/LocationAndDate/Actions';
import {
  getIsLoading, getIsFail, getDatePickerVisible, getLocationDatePopVisible, getProgress,
} from '../State/List/Selectors';
import { getFormatRentalDate } from '../State/LocationAndDate/Selectors';
import { isDebugMode } from '../State/Debug/Selectors';

const mapStateToProps = state => ({
  isDebugMode: isDebugMode(state),
  isLoading: getIsLoading(state),
  isFail: getIsFail(state),
  rentalDate: getFormatRentalDate(state),
  progress: getProgress(state),
  datePickerVisible: getDatePickerVisible(state),
  locationDatePopVisible: getLocationDatePopVisible(state),
});

const mapDispatchToProps = dispatch => ({
  initActiveGroupId: data => dispatch(initActiveGroupId(data)),
  setPageStatus: data => dispatch(getStatus(data)),
  fetchList: () => dispatch(fetchListBatchQuery()),
  setLocationInfo: rentalLocation => dispatch(setLocationInfo(rentalLocation)),
  setActiveFilterBarCode: data => dispatch(setActiveFilterBarCode(data)),
  setDatePickerIsShow: data => dispatch(setDatePickerIsShow(data)),
  setLocationAndDatePopIsShow: data => dispatch(setLocationAndDatePopIsShow(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(List);
