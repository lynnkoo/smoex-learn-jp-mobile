import { connect } from 'react-redux';

import Market from '../Pages/Market/Index';
import { loadMarket } from '../State/Market/Actions';
import { getLandingto } from '../State/Market/Selectors';

const mapStateToProps = state => ({
  landingto: getLandingto(state),
});

const mapDispatchToProps = dispatch => ({
  loadMarket: () => dispatch(loadMarket()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Market);
