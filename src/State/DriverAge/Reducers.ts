import { SET_AGE, GET_AGE } from './Types';
import { AgeActionType } from './Actions';
import { AgeConfig } from '../../Constants/Index';

const getInitalState = () => (
  {
    age: AgeConfig.DEFAULT_AGE.val,
  }
);

const initalState = getInitalState();

const setAge = (state, action) => ({ ...state, age: action.data.age || state.age });

export default function DriverAge(state = initalState, action: AgeActionType = { type: '' }) {
  switch (action.type) {
    case SET_AGE:
      return setAge(state, action);
    case GET_AGE:
    default:
      return state;
  }
}
