import { SET_STATUS, GET_STATUS } from './Types';

const getInitalState = () => ({ isLoading: true, isFail: false, progress: 0 });

const initalState = getInitalState();


export default (state = initalState, action) => {
  switch (action.type) {
    case SET_STATUS:
      return {
        ...state, isLoading: action.data.isLoading, isFail: action.data.isFail, progress: action.data.progress,
      };
    case GET_STATUS:
    default:
      return state;
  }
};
