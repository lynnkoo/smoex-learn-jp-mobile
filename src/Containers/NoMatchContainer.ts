import { connect } from 'react-redux';

import NoMatch from '../Pages/List/Components/NoMatch';
import {
  fetchListBatchQuery, setDatePickerIsShow, setLocationAndDatePopIsShow, setAgePickerIsShow,
} from '../State/List/Actions';
import { getRecommendInfo } from '../Global/Cache/ListResSelectors';
import { getAge } from '../State/DriverAgeAndNumber/Selectors';
import { setAge } from '../State/DriverAgeAndNumber/Actions';


const mapStateToProps = state => ({
  recommendInfo: getRecommendInfo(),
  age: getAge(state),
});

const mapDispatchToProps = dispatch => ({
  fetchList: () => dispatch(fetchListBatchQuery()),
  setDatePickerIsShow: data => dispatch(setDatePickerIsShow(data)),
  setLocationAndDatePopIsShow: data => dispatch(setLocationAndDatePopIsShow(data)),
  setAgePickerIsShow: data => dispatch(setAgePickerIsShow(data)),
  setAge: data => dispatch(setAge(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NoMatch);
