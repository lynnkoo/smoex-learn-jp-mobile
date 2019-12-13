import { connect } from 'react-redux';

import List from '../Pages/List/Index';
import { initActiveGroupId, getStatus, fetchListBatchQuery } from '../State/List/Actions';

import { getIsLoading, getIsFail } from '../State/List/Selectors';

const mapStateToProps = state => ({
  isLoading: getIsLoading(state),
  isFail: getIsFail(state),
});

const mapDispatchToProps = dispatch => ({
  initActiveGroupId: data => dispatch(initActiveGroupId(data)),
  setPageStatus: data => dispatch(getStatus(data)),
  fetchList: () => dispatch(fetchListBatchQuery()),
});

export default connect(mapStateToProps, mapDispatchToProps)(List);
