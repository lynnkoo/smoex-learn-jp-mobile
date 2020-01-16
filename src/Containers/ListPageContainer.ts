import { connect } from 'react-redux';

import List from '../Pages/List/Index';
import {
  initActiveGroupId, getStatus, fetchListBatchQuery,
  setDatePickerIsShow, setLocationAndDatePopIsShow, setAgePickerIsShow,
  setAgeTipPopIsShow, setFilterModalIsShow, setScrollViewHeight,
} from '../State/List/Actions';
import { setLocationInfo } from '../State/LocationAndDate/Actions';
import {
  getIsLoading, getIsFail, getDatePickerVisible, getLocationDatePopVisible, getAgePickerVisible,
  getAgeTipPopVisible, getSortAndFilterVisible, getFilterBarIsShow,
} from '../State/List/Selectors';
import { getFormatRentalDate, getRentalLocation } from '../State/LocationAndDate/Selectors';
import { getAge } from '../State/DriverAgeAndNumber/Selectors';
import { isDebugMode } from '../State/Debug/Selectors';

const mapStateToProps = state => ({
  isDebugMode: isDebugMode(state),
  isLoading: getIsLoading(state),
  isFail: getIsFail(state),
  indexCallbckData: {
    rentalDate: getFormatRentalDate(state),
    age: getAge(state),
    rentalLocation: getRentalLocation(state),
  },
  datePickerVisible: getDatePickerVisible(state),
  locationDatePopVisible: getLocationDatePopVisible(state),
  agePickerVisible: getAgePickerVisible(state),
  ageTipPopVisible: getAgeTipPopVisible(state),
  sortAndFilterVisible: getSortAndFilterVisible(state),
  filterBarIsShow: getFilterBarIsShow(state),
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
  setFilterModalIsShow: data => dispatch(setFilterModalIsShow(data)),
  setScrollViewHeight: data => dispatch(setScrollViewHeight(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(List);
