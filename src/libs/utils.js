/**
 * 将callback转换成Promise
 * @param {Function} Handler
 * @returns {Promise}
 * @constructor
 */
export function ToPromise(Handler) {
  return new Promise((resolve, reject) => {
    try {
      Handler(resolve, reject);
    }
    catch (e) {
      console.error(e);
      reject(e);
    }
  })
}

/**
 * 生成32位Guid
 * @returns {string}
 * @constructor
 */
export function Guid(prefix = "", length = 0) {
  prefix = String(prefix);
  if (prefix.length < length) {
    prefix = "000000000000" + prefix;
    prefix = prefix.substr(-length);
  }
  let timestamp = new Date().getTime();
  return prefix + 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.substr(prefix.length).replace(/[xy]/g, function (c) {
    let r = (timestamp + Math.random() * 16) % 16 | 0;
    timestamp = Math.floor(timestamp / 16);
    return (c === 'x' ? r : (r & 3 | 8)).toString(16);
  });
}