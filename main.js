import { CRNDev, App } from '@ctrip/crn';

import Demo from './build/Pages/Demo/Page1';
import Debug from './build/Pages/Debug';

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

const pages = [
  {
    component: Debug,
    name: 'Debug',
    isInitialPage: true
  },
  {
    component: Demo,
    name: 'Demo',
  }
];

const navigationBarConfig = {
  hide: true,
  backgroundColor: 'rgb(9, 159, 222)',
};

class rn_car_app extends App {
  constructor(props) {
    super(props);
    this.init({ pages, navigationBarConfig });
  }
}

module.exports = rn_car_app;