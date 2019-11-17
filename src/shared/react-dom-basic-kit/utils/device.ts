const mobileRegexp = /ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/

export const IS_MOBILE = mobileRegexp.test(navigator.userAgent.toLowerCase())
