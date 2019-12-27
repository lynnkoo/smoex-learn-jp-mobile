import { connect } from 'react-redux';

import List from '../Pages/List/Index';
import {
  initActiveGroupId, getStatus, fetchListBatchQuery,
  setDatePickerIsShow, setLocationAndDatePopIsShow, setAgePickerIsShow,
  setAgeTipPopIsShow,
} from '../State/List/Actions';
import { setLocationInfo } from '../State/LocationAndDate/Actions';
import {
  getIsLoading, getIsFail, getDatePickerVisible, getLocationDatePopVisible,
  getProgress, getAgePickerVisible, getAgeTipPopVisible,
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
  agePickerVisible: getAgePickerVisible(state),
  ageTipPopVisible: getAgeTipPopVisible(state),
});

const mapDispatchToProps = dispatch => ({
  initActiveGroupId: data => dispatch(initActiveGroupId(data)),
  setPageStatus: data => dispatch(getStatus(data)),
  fetchList: () => dispatch(fetchListBatchQuery()),
  setLocationInfo: rentalLocation => dispatch(setLocationInfo(rentalLocation)),
  setDatePickerIsShow: data => dispatch(setDatePickerIsShow(data)),
  setLocationAndDatePopIsShow: data => dispatch(setLocationAndDatePopIsShow(data)),
  setAgePickerIsShow: data => dispatch(setAgePickerIsShow(data)),
  setAgeTipPopIsShow: (data) => { dispatch(setAgeTipPopIsShow(data)); },
});

export default connect(mapStateToProps, mapDispatchToProps)(List);