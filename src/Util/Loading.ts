/**
 * todo: test
 * 此方法为解决android IBULoading 多次show的问题
 */
import { IBULoading, Loading } from '@ctrip/crn';
import Utils from './Utils';

class IBULoadingFn {
  show(params = { cancelable: false }, cancelCallback, type = 'detail') {
    if (this[`${type}_isLoadingShow`]) return;
    this[`${type}_isLoadingShow`] = true;
    // @ts-ignore
    if (Utils.isTrip()) {
      IBULoading.showLoadingDialog(params, cancelCallback);
    } else {
      // @ts-ignore
      Loading.showIconicLoadingV2(params, cancelCallback);
    }
  }

  hide(type = 'detail') {
    if (!this[`${type}_isLoadingShow`]) return;
    this[`${type}_isLoadingShow`] = false;
    IBULoading.dismissLoadingDialog();
    // @ts-ignore
    if (Utils.isTrip()) {
      IBULoading.dismissLoadingDialog();
    } else {
      // @ts-ignore
      Loading.hideIconicLoadingV2();
    }
  }
}
export default new IBULoadingFn();
