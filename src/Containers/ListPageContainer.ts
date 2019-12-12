import { connect } from 'react-redux';

import List from '../Pages/List/Index';
import { initActiveGroupId } from '../State/ListVehGroup/Actions';
import { getStatus } from '../State/ListStatus/Actions';
import { getIsLoading, getIsFail } from '../State/ListStatus/Selectors';

const mapStateToProps = state => ({
  isLoading: getIsLoading(state),
  isFail: getIsFail(state),
});

const mapDispatchToProps = dispatch => ({
  initActiveGroupId: data => dispatch(initActiveGroupId(data)),
  setPageStatus: data => dispatch(getStatus(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(List);
