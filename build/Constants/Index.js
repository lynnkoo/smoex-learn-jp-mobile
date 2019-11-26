import * as Platform from './Platform';
import TranslationKeys from './TranslationKeys/Index';
import { Utils } from '../Util/Index';
import PageIdIsd from './PageId/PageId.CTRIP_ISD';
import PageIdOsd from './PageId/PageId.CTRIP_OSD';
import PageIdTrip from './PageId/PageId.TRIP';
// /* eslint-disable global-require */
// const getPageId = () => {
//   switch (Utils.getAppType()) {
//     case Platform.APP_TYPE.CTRIP_ISD:
//       return require('./PageId/PageId.CTRIP_ISD').default;
//     case Platform.APP_TYPE.CTRIP_OSD:
//       return require('./PageId/PageId.CTRIP_OSD').default;
//     case Platform.APP_TYPE.TRIP:
//     default:
//       return require('./PageId/PageId.TRIP').default;
//   }
// };
// const LazyLoad = {
//   get PageId() { return getPageId(); },
// };
// module.exports = {
//   Platform,
//   TranslationKeys,
//   ...LazyLoad,
// };
/* eslint-disable global-require */
const getPageId = () => {
    switch (Utils.getAppType()) {
        case Platform.APP_TYPE.CTRIP_ISD: return PageIdIsd;
        case Platform.APP_TYPE.CTRIP_OSD: return PageIdOsd;
        case Platform.APP_TYPE.TRIP:
        default:
            return PageIdTrip;
    }
};
const PageId = getPageId();
export { Platform, TranslationKeys, PageId, };
