var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createLogic } from 'redux-logic';
import { INCREMENT, DECREMENT } from './Types';
// import { debugIncrement, debugDecrement } from './Actions';
// import { getCount } from './Selectors';
export const increment = createLogic({
    type: INCREMENT,
    /* eslint-disable no-empty-pattern */
    process({ getState }, dispatch, done) {
        return __awaiter(this, void 0, void 0, function* () {
            // logics
            console.log('INCREMENT', getState());
            done();
        });
    },
});
export const decrement = createLogic({
    type: DECREMENT,
    process({}, dispatch, done) {
        return __awaiter(this, void 0, void 0, function* () {
            // await dispatch(debugDecrement());
            // logics
            done();
        });
    },
});
export default [
    increment,
    decrement,
];
