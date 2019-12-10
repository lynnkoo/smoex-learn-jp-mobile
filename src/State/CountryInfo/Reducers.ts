import { SET_COUNTRY_INFO, GET_COUNTRY_INFO } from './Types';
import { CountryInfoActionType } from './Actions';

const getInitalState = () => ({ countryId: '', countryCode: '', countryName: '' });

const initalState = getInitalState();

const setCountryInfo = (state, action) => ({
  ...state,
  countryId: action.data.countryId || state.countryId,
  countryCode: action.data.countryCode || state.countryCode,
  countryName: action.data.countryName || state.countryName,
});

export default (state = initalState, action: CountryInfoActionType = { type: '' }) => {
  switch (action.type) {
    case SET_COUNTRY_INFO:
      return setCountryInfo(state, action);
    case GET_COUNTRY_INFO:
    default:
      return state;
  }
};
