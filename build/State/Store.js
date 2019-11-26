import { createStore, combineReducers, } from 'redux';
import enhancer from './Enhancer';
import debug from './Debug/Reducers';
import CountryInfoReducer from './CountryInfo/Reducers';
import LocationAndDateReducer from './LocationAndDate/Reducers';
import AgeReducer from './Age/Reducers';
import * as CountryInfoAction from './CountryInfo/Actions';
const rootReducer = combineReducers({
    debug,
    CountryInfoReducer,
    LocationAndDateReducer,
    AgeReducer,
});
let store;
const initialiseStore = () => {
    store = createStore(rootReducer, enhancer);
    store.dispatch(CountryInfoAction.getCountryInfo());
};
const getStore = () => {
    if (store) {
        return store;
    }
    throw new Error('Store is not initialised.');
};
export { initialiseStore, getStore, };
