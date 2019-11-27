import { SET_AGE, GET_AGE } from './Types';
import { AgeActionType } from './Actions';
import { AgeConfig } from '../../Constants/Index';

const getInitalState = () => (
  {
    age: AgeConfig.DEFAULT_AGE.val
  }
);

const initalState = getInitalState();

const setAge = (state, action) => {
  let curState = { ...state };
  if (action.data.age !== undefined) {
    curState = Object.assign({}, curState, { age: action.data.age });
  }
  return {
    ...curState,
  };
};

export default function AgeReducer(state = initalState, action: AgeActionType = { type: '' }) {
  switch (action.type) {
    case SET_AGE:
      return setAge(state, action);
    case GET_AGE:
      return state;
    default:
      return state;
  }
}
