import { connect } from 'react-redux';

import NoMatch from '../Pages/List/Components/NoMatch';
import {
  fetchListBatchQuery, setDatePickerIsShow, setLocationAndDatePopIsShow,
} from '../State/List/Actions';
import { getRecommendInfo } from '../Global/Cache/ListResSelectors';


const mapStateToProps = () => ({
  recommendInfo: getRecommendInfo(),
});

const mapDispatchToProps = dispatch => ({
  fetchList: () => dispatch(fetchListBatchQuery()),
  setDatePickerIsShow: data => dispatch(setDatePickerIsShow(data)),
  setLocationAndDatePopIsShow: data => dispatch(setLocationAndDatePopIsShow(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NoMatch);
