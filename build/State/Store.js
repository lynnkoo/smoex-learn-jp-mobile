import { createStore, combineReducers, } from 'redux';
import enhancer from './Enhancer';
import debug from './Debug/Reducers';
const rootReducer = combineReducers({
    debug,
});
let store;
const initialiseStore = () => {
    store = createStore(rootReducer, enhancer);
};
const getStore = () => {
    if (store) {
        return store;
    }
    throw new Error('Store is not initialised.');
};
export { initialiseStore, getStore, };
