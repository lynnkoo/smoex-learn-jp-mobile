import { connect } from 'react-redux';
import TipList from '../Pages/List/Components/TipList';
import { getPromotionFilterText } from '../State/List/Mappers';

const mapStateToProps = () => ({
  promotionFilterText: getPromotionFilterText(),
  promotionFilterSelected: false, // todo
});

const mapDispatchToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(TipList);
