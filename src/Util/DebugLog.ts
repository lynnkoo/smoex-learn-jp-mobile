import { Util } from '@ctrip/crn';

const debugLog = {
  time: (label: string) => {
    if (Util.isInChromeDebug) {
      /* eslint-disable no-console */
      console.time(label);
    }
  },
  timeEnd: (label: string) => {
    if (Util.isInChromeDebug) {
      /* eslint-disable no-console */
      console.timeEnd(label);
    }
  },
  timeLog: (label?: string, ...data: any[]) => {
    if (Util.isInChromeDebug) {
      /* eslint-disable no-console */
      console.timeLog(label, data);
    }
  },
};

export default debugLog;
