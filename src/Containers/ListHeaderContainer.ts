import { connect } from 'react-redux';
import BbkComponentCarHeader from '@ctrip/bbk-component-car-header';
import { AppContext } from '../Util/Index';
import {
  getPickUpTime,
  getDropOffTime,
  getPickUpLocationCode,
  getPickUpLocationName,
  getPickUpLocationType,
  getDropOffLocationCode,
  getDropOffLocationName,
  getDropOffLocationType,
} from '../State/LocationAndDate/Selectors';

const mapStateToProps = state => ({
  data: {
    ptime: getPickUpTime(state),
    rtime: getDropOffTime(state),
    pickupLocation: {
      locationType: getPickUpLocationType(state),
      locationCode: getPickUpLocationCode(state),
      locationName: getPickUpLocationName(state),
    },
    returnLocation: {
      locationType: getDropOffLocationType(state),
      locationCode: getDropOffLocationCode(state),
      locationName: getDropOffLocationName(state),
    },
  },
  enableChange: true,
  currency: AppContext.LanguageInfo.currency,
});

/* eslint-disable no-unused-vars */
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(BbkComponentCarHeader);
