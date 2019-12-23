import { connect } from 'react-redux';
import TipList from '../Pages/List/Components/TipList';
import { getSelectedFilters } from '../State/List/Selectors';
import { getPromotionFilterText, getPromotionFilterCode, getPromotionFilterIsSelect } from '../State/List/Mappers';
import { updateSelectedFilter } from '../State/List/Actions';

const mapStateToProps = state => ({
  selectedFilters: getSelectedFilters(state),
  promotionFilterText: getPromotionFilterText(),
  promotionFilterCode: getPromotionFilterCode(),
  promotionFilterSelected: getPromotionFilterIsSelect(state),
});

const mapDispatchToProps = dispatch => ({
  updateSelectedFilter: data => dispatch(updateSelectedFilter(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TipList);
