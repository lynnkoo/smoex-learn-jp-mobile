/* eslint-disable no-undef */
import { applyMiddleware, compose } from 'redux';
import { logicMiddleware } from './LogicStore';

// @ts-ignore
const composeEnhancers = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
// @ts-ignore
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
  })
  : compose;

const enhancer = composeEnhancers(
  applyMiddleware(logicMiddleware),
);

export default enhancer;
