import * as TYPES from './Types';

export default (state = {}, action) => {
  const actionType = action.type;
  if (actionType === TYPES.LOAD_COMPLETED) {
    return {
      ...state,
      landingto: action.data.landingto,
    };
  }

  if (actionType === TYPES.LOAD_FAILED) {
    return {
      ...state,
      err: action.data.err,
      landingto: action.data.landingto,
    };
  }

  return state;
};
