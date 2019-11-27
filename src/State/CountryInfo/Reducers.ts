import { SET_COUNTRY_INFO, GET_COUNTRY_INFO } from './Types';
import { CountryInfoActionType } from './Actions';

const getInitalState = () => (
  {
    countryId: '',
    countryCode: '',
    countryName: '',
  }
);

const initalState = getInitalState();
// const initalStateClone = JSON.stringify(initalState);

const setCountryInfo = (state, action) => {
  const { countryId, countryCode, countryName } = action.data;

  const newCountryId = countryId || state.countryId;
  const newCountryCode = countryCode || state.countryCode;
  const newCountryName = countryName || state.countryName;
  return {
    ...state,
    ...{
      countryId: newCountryId,
      countryCode: newCountryCode,
      countryName: newCountryName,
    },
  };
};

export default function CountryInfoReducer(state = initalState, action: CountryInfoActionType = { type: '' }) {
  switch (action.type) {
    case SET_COUNTRY_INFO:
      return setCountryInfo(state, action);
    case GET_COUNTRY_INFO:
    default:
      return state;
  }
}
