import {
  createStore,
  combineReducers,
  Store,
} from 'redux';

import enhancer from './Enhancer';
import debug from './Debug/Reducers';

const rootReducer = combineReducers({
  debug,
});

let store: Store;

const initialiseStore = (): void => {
  store = createStore(rootReducer, enhancer);
};

const getStore = (): Store => {
  if (store) {
    return store;
  }
  throw new Error('Store is not initialised.');
};

const initialiseAppState = (): void => {
  // store.dispatch()
};

export {
  initialiseStore,
  getStore,
  initialiseAppState,
};
