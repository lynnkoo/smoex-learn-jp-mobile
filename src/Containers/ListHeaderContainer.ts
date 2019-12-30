import { connect } from 'react-redux';
import BbkComponentCarHeader from '@ctrip/bbk-component-car-header';
import { AppContext, CarLog } from '../Util/Index';
import { ClickKey } from '../Constants/Index';
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
import { fetchListBatchQuery } from '../State/List/Actions';
import { getProgress } from '../State/List/Selectors';

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
  enableChange: getProgress(state) === 1,
  currency: AppContext.LanguageInfo.currency,
});

const mapDispatchToProps = dispatch => ({
  onPressHeaderRight: (data) => {
    if (data && data.code) {
      AppContext.setLanguageCurrency(data.code);
      dispatch(fetchListBatchQuery());
      CarLog.LogCode({ enName: ClickKey.C_LIST_HEADER_SWITCH_CURRENCY.KEY });
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(BbkComponentCarHeader);
