import { connect } from 'react-redux';

import List from '../Pages/List/Index';
import {
  initActiveGroupId, getStatus, fetchListBatchQuery, setDatePickerIsShow, setLocationAndDatePopIsShow,
} from '../State/List/Actions';
import { setLocationInfo } from '../State/LocationAndDate/Actions';

import {
  getIsLoading, getIsFail, getDatePickerVisible, getLocationDatePopVisible, getProgress,
} from '../State/List/Selectors';
import { getFormatRentalDate } from '../State/LocationAndDate/Selectors';

const mapStateToProps = state => ({
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
  setDatePickerIsShow: data => dispatch(setDatePickerIsShow(data)),
  setLocationAndDatePopIsShow: data => dispatch(setLocationAndDatePopIsShow(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(List);
