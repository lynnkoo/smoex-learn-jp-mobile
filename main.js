import { CRNDev } from '@ctrip/crn';
import RnCarApp from './build/Index';

/* eslint-disable */
if (__DEV__) {
  CRNDev.registryIconFont({
    fontList: [
      'http://127.0.0.1:5389/fonts/crn_font_osd.ttf',
      'http://127.0.0.1:5389/fonts/crn_font_osd2.ttf',
      'http://127.0.0.1:5389/fonts/crn_font_osd_common.ttf'
    ]
  }, (result) => {
  });
}


module.exports = RnCarApp;