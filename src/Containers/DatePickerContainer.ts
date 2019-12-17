import { connect } from 'react-redux';

import RentalCarsDatePicker from '@ctrip/bbk-component-car-date-picker';
import { getDatePickerVisible } from '../State/List/Selectors';
import { getPickUpTime, getDropOffTime } from '../State/LocationAndDate/Selectors';


const mapStateToProps = state => ({
  visible: getDatePickerVisible(state),
  focusOnRtime: false,
  maxmonths: 12,
  ptime: getPickUpTime(state),
  rtime: getDropOffTime(state),
});

/* eslint-disable no-unused-vars */
const mapDispatchToProps = dispatch => ({
  onConfirm: () => { console.log('onConfirm+++'); },
  onCancel: () => { console.log('onCancel+++'); },
});

export default connect(mapStateToProps, mapDispatchToProps)(RentalCarsDatePicker);
