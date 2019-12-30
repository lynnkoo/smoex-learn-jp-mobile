import { CRNDev } from '@ctrip/crn';
import RnCarApp from './build/Index';

/* eslint-disable */
if (__DEV__) {
  CRNDev.registryIconFont({
    fontList: [
      'http://127.0.0.1:5389/fonts/crn_font_cars_v7.ttf',
    ]
  }, (result) => {
  });
}

module.exports = RnCarApp;
