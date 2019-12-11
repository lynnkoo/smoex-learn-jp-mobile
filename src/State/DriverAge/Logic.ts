import { createLogic } from 'redux-logic';
import { GET_AGE } from './Types';
import { setAge } from './Actions';
import { AppContext } from '../../Util/Index';
import { AgeConfig } from '../../Constants/Index';


export const setCommonAge = createLogic({
  type: GET_AGE,
  /* eslint-disable no-empty-pattern */
  async process({ }, dispatch, done) {
    const { age } = AppContext.UrlQuery;
    if (age) {
      let curAge = age;
      const urlAge = Number(age);
      if (urlAge < AgeConfig.MIN_AGE) {
        curAge = AgeConfig.MIN_AGE.toString();
      } else if (urlAge > AgeConfig.MAX_AGE) {
        curAge = AgeConfig.MAX_AGE.toString();
      } else if (urlAge >= AgeConfig.DEFAULT_AGE.min && urlAge <= AgeConfig.DEFAULT_AGE.max) {
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
