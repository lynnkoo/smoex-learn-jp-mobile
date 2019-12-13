import {
  createStore,
  combineReducers,
  Store,
} from 'redux';
import enhancer from './Enhancer';
import debug from './Debug/Reducers';
import CountryInfo from './CountryInfo/Reducers';
import LocationAndDate from './LocationAndDate/Reducers';
import DriverAge from './DriverAge/Reducers';
import Market from './Market/Reducers';
import List from './List/Reducer';
import { getCountryInfo } from './CountryInfo/Actions';
import { getLocationAndDateInfo } from './LocationAndDate/Actions';
import { getDriverAge } from './DriverAge/Actions';

const rootReducer = combineReducers({
  debug,
  CountryInfo,
  LocationAndDate,
  DriverAge,
  Market,
  List,
});

let store: Store = null;

const initialiseStore = (): void => {
  store = store || createStore(rootReducer, enhancer);
};

const getStore = (): Store => {
  if (store) {
    return store;
  }
  throw new Error('Store is not initialised.');
};

const initialiseAppState = (): void => {
  store.dispatch(getCountryInfo());
  store.dispatch(getLocationAndDateInfo());
  store.dispatch(getDriverAge());
};

export {
  initialiseStore,
  getStore,
  initialiseAppState,
};
