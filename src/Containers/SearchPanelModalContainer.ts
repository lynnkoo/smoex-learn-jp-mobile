import { connect } from 'react-redux';
import SearchPanelModal from '../Pages/List/Components/SearchPanelModal';
import {
  getPickUpTime,
  getDropOffTime,
  getPickUpLocationCode,
  getPickUpLocationName,
  getPickUpLocationType,
  getDropOffLocationCode,
  getDropOffLocationName,
  getDropOffLocationType,
  getPickUpCityId,
  getPickUpLocationLat,
  getPickUpLocationLng,
  getDropOffCityId,
  getDropOffLocationLat,
  getDropOffLocationLng,
  getIsOneWay,
  getRentalLocation,
} from '../State/LocationAndDate/Selectors';
import { getAge } from '../State/DriverAgeAndNumber/Selectors';
import { getDatePickerVisible, getLocationDatePopVisible } from '../State/List/Selectors';
import { setLocationAndDatePopIsShow, fetchListBatchQuery } from '../State/List/Actions';
import { setAge } from '../State/DriverAgeAndNumber/Actions';
import { setDateInfo, setLocationInfo } from '../State/LocationAndDate/Actions';

const mapStateToProps = state => ({
  visible: getLocationDatePopVisible(state),
  showDatePicker: getDatePickerVisible(state),
  rentalLocation: getRentalLocation(state),
  ptime: getPickUpTime(state),
  rtime: getDropOffTime(state),
  pcity: {
    cityId: getPickUpCityId(state),
    latitude: getPickUpLocationLat(state),
    longtitude: getPickUpLocationLng(state),
    locationCode: getPickUpLocationCode(state),
    locationName: getPickUpLocationName(state),
    locationType: getPickUpLocationType(state),
  },
  rcity: {
    cityId: getDropOffCityId(state),
    latitude: getDropOffLocationLat(state),
    longtitude: getDropOffLocationLng(state),
    locationCode: getDropOffLocationCode(state),
    locationName: getDropOffLocationName(state),
    locationType: getDropOffLocationType(state),
  },
  age: getAge(state),
  showDropoff: getIsOneWay(state),
});

const mapDispatchToProps = dispatch => ({
  setLocationAndDatePopIsShow: (data) => { dispatch(setLocationAndDatePopIsShow(data)); },
  setAge: (data) => { dispatch(setAge(data)); },
  setDateInfo: (data) => { dispatch(setDateInfo(data)); },
  fetchList: () => dispatch(fetchListBatchQuery()),
  setLocationInfo: (data) => { dispatch(setLocationInfo(data)); },
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchPanelModal);
