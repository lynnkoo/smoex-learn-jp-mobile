import {
  createStore,
  combineReducers,
  Store,
} from 'redux';

import enhancer from './Enhancer';

import LocationAndDateReducer from './LocationAndDate/Reducers';
import * as LocationAndDateAction from './LocationAndDate/Actions';

const rootReducer = combineReducers({
  LocationAndDateReducer,
});

let store: Store;

const initialiseStore = (): void => {
  store = createStore(rootReducer, enhancer);
  store.dispatch(LocationAndDateAction.getCountryInfo());
};

const getStore = (): Store => {
  if (store) {
    return store;
  }
  throw new Error('Store is not initialised.');
};

export {
  initialiseStore,
  getStore,
};
