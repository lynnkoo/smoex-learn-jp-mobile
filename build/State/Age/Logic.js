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
import { GET_AGE } from './Types';
import { setAge } from './Actions';
import { AppContext } from '../../Util/Index';
import { AgeConfig } from '../../Constants/Index';
export const setCommonAge = createLogic({
    type: GET_AGE,
    /* eslint-disable no-empty-pattern */
    process({}, dispatch, done) {
        return __awaiter(this, void 0, void 0, function* () {
            let { age } = AppContext.UrlQuery;
            if (age) {
                let curAge = age;
                age = Number(age);
                if (age < AgeConfig.MIN_AGE) {
                    curAge = AgeConfig.MIN_AGE;
                }
                else if (age > AgeConfig.MAX_AGE) {
                    curAge = AgeConfig.MAX_AGE;
                }
                else if (age >= AgeConfig.DEFAULT_AGE.min && age <= AgeConfig.DEFAULT_AGE.max) {
                    curAge = AgeConfig.DEFAULT_AGE.val;
                }
                yield dispatch(setAge(curAge));
            }
            done();
        });
    },
});
export default [
    setCommonAge,
];
