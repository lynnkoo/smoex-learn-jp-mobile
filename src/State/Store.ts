import {
  createStore,
  combineReducers,
  Store,
} from 'redux';
import enhancer from './Enhancer';
import debug from './Debug/Reducers';
import CountryInfoReducer from './CountryInfo/Reducers';
import LocationAndDateReducer from './LocationAndDate/Reducers';
import AgeReducer from './Age/Reducers';
import * as CountryInfoAction from './CountryInfo/Actions';
import * as LocationAndDateAction from './LocationAndDate/Actions';
import * as AgeAction from './Age/Actions';

const rootReducer = combineReducers({
  debug,
  CountryInfoReducer,
  LocationAndDateReducer,
  AgeReducer,
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
  store.dispatch(CountryInfoAction.getCountryInfo());
  store.dispatch(LocationAndDateAction.getLocationAndDateInfo());
  store.dispatch(AgeAction.getAge());
};

export {
  initialiseStore,
  getStore,
  initialiseAppState,
};
