import { connect } from 'react-redux';

import Debug from '../Pages/Debug/Debug';
import { debugDecrement, debugIncrement } from '../State/Debug/Actions';
import { getCount } from '../State/Debug/Selectors';

const mapStateToProps = state => ({
  texts: {},
  count: getCount(state),
});

const mapDispatchToProps = dispatch => ({
  debugIncrement: () => dispatch(debugIncrement()),
  debugDecrement: () => dispatch(debugDecrement()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Debug);
