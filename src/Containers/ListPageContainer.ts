import { connect } from 'react-redux';

import List from '../Pages/List/Index';
import {
  initActiveGroupId, getStatus, fetchListBatchQuery, setActiveFilterBarCode,
} from '../State/List/Actions';
import { setLocationInfo } from '../State/LocationAndDate/Actions';

import { getIsLoading, getIsFail } from '../State/List/Selectors';
import { getFormatRentalDate } from '../State/LocationAndDate/Selectors';

const mapStateToProps = state => ({
  isLoading: getIsLoading(state),
  isFail: getIsFail(state),
  rentalDate: getFormatRentalDate(state),
});

const mapDispatchToProps = dispatch => ({
  initActiveGroupId: data => dispatch(initActiveGroupId(data)),
  setPageStatus: data => dispatch(getStatus(data)),
  fetchList: () => dispatch(fetchListBatchQuery()),
  setLocationInfo: rentalLocation => dispatch(setLocationInfo(rentalLocation)),
  setActiveFilterBarCode: data => dispatch(setActiveFilterBarCode(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(List);
