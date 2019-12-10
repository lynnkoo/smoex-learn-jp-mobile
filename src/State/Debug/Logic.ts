import { createLogic } from 'redux-logic';
import { INCREMENT, DECREMENT } from './Types';
// import { debugIncrement, debugDecrement } from './Actions';
// import { getCount } from './Selectors';

export const increment = createLogic({
  type: INCREMENT,
  /* eslint-disable no-empty-pattern */
  async process({ }, dispatch, done) {
    // logics
    // console.log('INCREMENT', getState());
    done();
  },
});

export const decrement = createLogic({
  type: DECREMENT,

  async process({ }, dispatch, done) {
    // await dispatch(debugDecrement());
    // logics
    done();
  },
});

export default [
  increment,
  decrement,
];
