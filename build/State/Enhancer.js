import { applyMiddleware, compose } from 'redux';
import { logicMiddleware } from './LogicStore';
const enhancer = compose(applyMiddleware(logicMiddleware));
export default enhancer;
