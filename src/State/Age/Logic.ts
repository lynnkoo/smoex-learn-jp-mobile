import { createLogic } from 'redux-logic';
import { GET_AGE } from './Types';
import { setAge } from './Actions';
import { AppContext } from '../../Util/Index';
import { AgeConfig } from '../../Constants/Index';


export const setCommonAge = createLogic({
  type: GET_AGE,
  /* eslint-disable no-empty-pattern */
  async process({ }, dispatch, done) {
    let { age } = AppContext.UrlQuery;
    if (age) {
      let curAge = age;
      age = Number(age);
      if (age < AgeConfig.MIN_AGE) {
        curAge = AgeConfig.MIN_AGE;
      } else if (age > AgeConfig.MAX_AGE) {
        curAge = AgeConfig.MAX_AGE;
      } else if (age >= AgeConfig.DEFAULT_AGE.min && age <= AgeConfig.DEFAULT_AGE.max) {
        curAge = AgeConfig.DEFAULT_AGE.val;
      }
      await dispatch(setAge(curAge));
    }
    done();
  },
});

export default [
  setCommonAge,
];
