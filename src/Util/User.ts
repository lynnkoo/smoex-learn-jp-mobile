import { User } from '@ctrip/crn';
import AppContext from './AppContext';

export const toLogin = (options = {}) => new Promise((resolve) => {
  User.userLoginWithParams(
    {
      showNonMember: true,
      isNonMemberOrder: true,
      ...options,
    },
    (status, userInfo) => {
      if (userInfo && userInfo.data && userInfo.data.Auth) {
        AppContext.setUserInfo(userInfo);
        resolve(true);
      } else {
        resolve(false);
      }
    },
  );
});

export const isLogin = async () => {
  if (AppContext.UserInfo.Auth) {
    return true;
  }
  return new Promise((resolve) => {
    User.getUserInfo((status, userInfo) => {
      if (userInfo && userInfo.data && userInfo.data.Auth) {
        AppContext.setUserInfo(userInfo);
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};
