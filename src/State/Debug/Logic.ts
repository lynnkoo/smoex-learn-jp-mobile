import { createLogic } from 'redux-logic';
import { INCREMENT, DECREMENT } from './Types';
import { debugIncrement, debugDecrement } from './Actions';

export const increment = createLogic({
  type: INCREMENT,
  /* eslint-disable no-empty-pattern */
  async process({ }, dispatch, done) {
    await dispatch(debugIncrement());
    done();
  },
});

export const decrement = createLogic({
  type: DECREMENT,

  async process({ }, dispatch, done) {
    await dispatch(debugDecrement());
    done();
  },
});

export default [
  increment,
  decrement,
];
