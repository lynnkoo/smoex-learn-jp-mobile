import {
  createStore,
  combineReducers,
  Store,
} from 'redux';
import enhancer from './Enhancer';
import debug from './Debug/Reducers';
import CountryInfo from './CountryInfo/Reducers';
import LocationAndDate from './LocationAndDate/Reducers';
import DriverAgeAndNumber from './DriverAgeAndNumber/Reducers';
import Market from './Market/Reducers';
import List from './List/Reducer';
import { getCountryInfo } from './CountryInfo/Actions';
import { getLocationAndDateInfo } from './LocationAndDate/Actions';
import { getDriverAge } from './DriverAgeAndNumber/Actions';
import { getDebugMode } from './Debug/Actions';

const rootReducer = combineReducers({
  debug,
  CountryInfo,
  LocationAndDate,
  DriverAgeAndNumber,
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

const unmountStore = () => {
  store = null;
};

const initialiseAppState = async (): Promise<void> => {
  store.dispatch(getCountryInfo());
  store.dispatch(getLocationAndDateInfo());
  store.dispatch(getDriverAge());
  store.dispatch(getDebugMode());
};

export {
  initialiseStore,
  getStore,
  unmountStore,
  initialiseAppState,
};
