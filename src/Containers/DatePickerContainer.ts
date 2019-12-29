import { connect } from 'react-redux';

import ListDatePicker from '../Pages/List/Components/DatePicker';
import { getDatePickerVisible } from '../State/List/Selectors';
import { getPickUpTime, getDropOffTime } from '../State/LocationAndDate/Selectors';
import { setDateInfo } from '../State/LocationAndDate/Actions';
import { setDatePickerIsShow, fetchListBatchQuery } from '../State/List/Actions';


const mapStateToProps = state => ({
  visible: getDatePickerVisible(state),
  focusOnRtime: false,
  maxmonths: 12,
  ptime: getPickUpTime(state),
  rtime: getDropOffTime(state),
});

/* eslint-disable no-unused-vars */
const mapDispatchToProps = dispatch => ({
  setDateInfo: (data) => { dispatch(setDateInfo(data)); },
  setDatePickerIsShow: (data) => { dispatch(setDatePickerIsShow(data)); },
  fetchList: () => dispatch(fetchListBatchQuery()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ListDatePicker);
