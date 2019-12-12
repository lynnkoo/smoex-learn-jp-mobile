import { connect } from 'react-redux';
import BbkComponentCarHeader from '@ctrip/bbk-component-car-header';
import { AppContext } from '../Util/Index';
import {
  getPickUpTime,
  getDropOffTime,
  getPickUpCityId,
  getPickUpLocationCode,
  getPickUpLocationName,
  getPickUpLocationType,
  getPickUpLocationLat,
  getPickUpLocationlng,
  getDropOffCityId,
  getDropOffLocationCode,
  getDropOffLocationName,
  getDropOffLocationType,
  getDropOffLocationLat,
  getDropOffLocationlng,
} from '../State/LocationAndDate/Selectors';

const mapStateToProps = state => ({
  data: {
    ptime: getPickUpTime(state).format('YYYY-MM-DD HH:mm:ss'),
    rtime: getDropOffTime(state).format('YYYY-MM-DD HH:mm:ss'),
    pickupLocation: {
      locationType: getPickUpLocationType(state),
      cityId: Number(getPickUpCityId(state)),
      locationCode: getPickUpLocationCode(state),
      locationName: getPickUpLocationName(state),
      poi: {
        longitude: parseFloat(getPickUpLocationLat(state) || 0),
        latitude: parseFloat(getPickUpLocationlng(state) || 0),
        radius: 0.0,
      },
    },
    returnLocation: {
      locationType: getDropOffLocationType(state),
      cityId: Number(getDropOffCityId(state)),
      locationCode: getDropOffLocationCode(state),
      locationName: getDropOffLocationName(state),
      poi: {
        longitude: parseFloat(getDropOffLocationLat(state) || 0),
        latitude: parseFloat(getDropOffLocationlng(state) || 0),
        radius: 0.0,
      },
    },
  },
  enableChange: true,
  currency: AppContext.LanguageInfo.currency,
});

/* eslint-disable no-unused-vars */
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(BbkComponentCarHeader);
