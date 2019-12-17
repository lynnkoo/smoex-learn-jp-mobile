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
import { setLocationAndDatePopIsShow, fetchListBatchQuery } from '../State/List/Actions';

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

const mapDispatchToProps = dispatch => ({
  showSearchSelectorWrap: () => { dispatch(setLocationAndDatePopIsShow({ visible: true })); },
  onPressHeaderRight: (data) => {
    if (data && data.code) {
      AppContext.setLanguageCurrency(data.code);
      dispatch(fetchListBatchQuery());
      // todo log
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(BbkComponentCarHeader);
