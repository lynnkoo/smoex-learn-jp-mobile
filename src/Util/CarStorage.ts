import { Storage, Util } from '@ctrip/crn';
import AppContext from './AppContext';
import StorageKey from '../Constants/StorageKey';

const EXPIRES = '7d';

// 格式化时间字符串，接受一个格式化的字符串，例如`1d`,`3 weeks`等, 返回对应的秒数，
// 如果传入数字或者可以通过Number强制转为数字，返回该数字
// 关键字: ['months','weeks','days','hours','minutes','seconds']
// 支持简写: ['M',     'w',    'd',   'H',    'm',      's']
const format2Seconds = (str: any) => {
  function count(num, type) {
    let base = 1;
    const newType = type || 's';
    if (!Number(num)) return null;
    switch (newType) {
      case 'M':
        base = 30 * 24 * 60 * 60;
        break;
      case 'w':
        base = 7 * 24 * 60 * 60;
        break;
      case 'd':
        base = 24 * 60 * 60;
        break;
      case 'H':
        base = 60 * 60;
        break;
      case 'm':
        base = 60;
        break;
      case 's':
        base = 1;
        break;
      default:
        base = 1;
        break;
    }
    return num * base;
  }
  const arr1 = ['months', 'weeks', 'days', 'hours', 'minutes', 'seconds'];
  const arr2 = ['M', 'w', 'd', 'H', 'm', 's'];
  let finded = false;
  let num = Number(str);
  if (num) return num;
  num = null;
  arr1.forEach((item, index) => {
    if (str.indexOf(item) > -1) {
      finded = true;
      num = count(str.match(/[0-9]+/), arr2[index]);
    }
  });
  if (!finded) {
    arr2.forEach((item) => {
      const reg = new RegExp(`[^a-z]+${item}$`);
      const match = str.match(reg);
      if (match && match.length > 0) {
        finded = true;
        num = count(str.match(/[0-9]+/), item);
      }
    });
  }
  if (!finded) {
    throw new Error(`the ${str} cannot be formated to number`);
  }
  return num;
};

const getExpires = (expires: string) => (expires ? format2Seconds(expires) : null);

const getKey = (key: string) => `${AppContext.LanguageInfo.locale}_${key}`;

const load = async (key: string) => (
  // @ts-ignore
  // todo: crn ts define missing
  Storage.loadPromise({
    key: getKey(key),
    domain: StorageKey.DOMAIN,
  }));

const loadSync = (key: string) => Storage.loadSync({
  key: getKey(key),
  domain: StorageKey.DOMAIN,
});

class CarStorage {
  static loadSync = (key: string) => {
    if (Util.isInChromeDebug) {
      /* eslint-disable no-console */
      console.warn(`Warning: In debug model, 
      Storage.loadSync return type is promise, please caution!`);
    }
    return Util.isInChromeDebug ? load(key) : loadSync(key);
  }

  static save = (key: string, value: any, expires = EXPIRES) => {
    Storage.save({
      key: getKey(key),
      value,
      domain: StorageKey.DOMAIN,
      expires: getExpires(expires),
    });
  }

  static remove = (key: string) => {
    Storage.remove({
      key: getKey(key),
      domain: StorageKey.DOMAIN,
    });
  }
}

export default CarStorage;
