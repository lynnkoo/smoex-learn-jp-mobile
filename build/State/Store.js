import { createStore, combineReducers, } from 'redux';
import enhancer from './Enhancer';
import debug from './Debug/Reducers';
import LocationAndDateReducer from './LocationAndDate/Reducers';
import * as LocationAndDateAction from './LocationAndDate/Actions';
const rootReducer = combineReducers({
    debug,
    LocationAndDateReducer,
});
let store;
const initialiseStore = () => {
    store = createStore(rootReducer, enhancer);
    store.dispatch(LocationAndDateAction.getCountryInfo());
};
const getStore = () => {
    if (store) {
        return store;
    }
    throw new Error('Store is not initialised.');
};
export { initialiseStore, getStore, };
