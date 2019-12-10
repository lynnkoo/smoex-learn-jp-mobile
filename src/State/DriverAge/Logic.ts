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
      const ageNumber = Number(age);
      if (ageNumber < AgeConfig.MIN_AGE) {
        curAge = String(AgeConfig.MIN_AGE);
      } else if (ageNumber > AgeConfig.MAX_AGE) {
        curAge = String(AgeConfig.MAX_AGE);
      } else if (ageNumber >= AgeConfig.DEFAULT_AGE.min && ageNumber <= AgeConfig.DEFAULT_AGE.max) {
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
