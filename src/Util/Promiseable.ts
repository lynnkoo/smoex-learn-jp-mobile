// /**
//  * getLocalDateTime = (callback) => { callback(data) }
//  * --> await promisable(getLocalDateTime)();
//  *
//  * getLocalDateTime2 = (params, callback) => { callback(data) }
//  * --> await promisable(getLocalDateTime2)(params);
//  *
//  *
//  * getLocalDateTime3 = (params, callback, options) => { callback(status, data) }
//  * --> await promisable(getLocalDateTime3)(params,'callback',options)
//  *
//  */
export const promiseable = (func: Function) => (...params: any) => (new Promise((resolve) => {
  const cb = (...datas: any) => resolve(...datas);
  const args = [...params];
  const index = args.findIndex(f => f === 'callback');
  args[index > -1 ? index : args.length] = cb;
  func(...args);
}));

export default promiseable;
