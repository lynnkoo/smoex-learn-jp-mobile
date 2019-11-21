import * as Platform from './Platform';
import TranslationKeys from './TranslationKeys/Index';
import { Utils } from '../Util/Index';

/* eslint-disable global-require */
const getPageId = () => {
  switch (Utils.getAppType()) {
    case Platform.APP_TYPE.CTRIP_ISD:
      return require('./PageId/PageId.CTRIP_ISD').default;
    case Platform.APP_TYPE.CTRIP_OSD:
      return require('./PageId/PageId.CTRIP_OSD').default;
    case Platform.APP_TYPE.TRIP:
    default:
      return require('./PageId/PageId.TRIP').default;
  }
};

const LazyLoad = {
  get PageId() { return getPageId(); },
};

module.exports = {
  Platform,
  TranslationKeys,
  ...LazyLoad,
};
