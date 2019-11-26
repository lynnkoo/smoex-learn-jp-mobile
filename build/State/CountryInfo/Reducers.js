import { SET_COUNTRY_INFO, GET_COUNTRY_INFO } from './Types';
const getInitalState = () => ({
    countryId: '',
    countryCode: '',
    countryName: '',
});
const initalState = getInitalState();
// const initalStateClone = JSON.stringify(initalState);
const setCountryInfo = (state, action) => {
    let curState = Object.assign({}, state);
    if (action.data.countryId) {
        curState = Object.assign({}, curState, { countryId: action.data.countryId });
    }
    if (action.data.countryCode) {
        curState = Object.assign({}, curState, { countryCode: action.data.countryCode });
    }
    if (action.data.countryName) {
        curState = Object.assign({}, curState, { countryName: action.data.countryName });
    }
    return Object.assign({}, curState);
};
export default function CountryInfoReducer(state = initalState, action = { type: '' }) {
    switch (action.type) {
        case SET_COUNTRY_INFO:
            return setCountryInfo(state, action);
        case GET_COUNTRY_INFO:
            return state;
        default:
            return state;
    }
}
