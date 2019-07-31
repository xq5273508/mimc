import {ToPromise} from "./utils";


/**
 * 数据请求
 * @param url       {string}    数据请求地址
 * @param method    {string}    数据请求Method方式
 * @param data      {Object}    请求的数据
 * @param headers   {Object}    请求携带的Header信息
 * @param async     {boolean}   是否异步请求
 * @returns {*}
 * @constructor
 */
export function HttpRequest(url, method, data, headers = {}, async = true) {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url, async);
  xhr.setRequestHeader('content-type', 'application/json');
  let header;
  for (header in headers) {
    xhr.setRequestHeader(header, headers[header]);
  }
  if (async) {
    return ToPromise((success, fail) => {
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const result = JSON.parse(xhr.response);
          if (result.code === 200) {
            success(result);
          } else {
            fail(result.message);
          }
        } else if (xhr.status !== 200) {
          fail(xhr.status);
        }
      };
      xhr.send(data ? JSON.stringify(data) : undefined);
    });
  }
  else {
    xhr.send(data ? JSON.stringify(data) : undefined);
    return JSON.parse(xhr.response);
  }
}

/**
 * 同步方式调用GET
 * @param url       {string}    数据请求地址
 * @param data      {Object}    请求的数据
 * @param headers   {Object}    请求携带的Header信息
 * @returns {*}
 */
export function GetSync(url, data, headers) {
  return HttpRequest(url, "GET", data, headers, false);
}

/**
 * 异步方式调用GET，返回Promise
 * @param url       {string}    数据请求地址
 * @param data      {Object}    请求的数据
 * @param headers   {Object}    请求携带的Header信息
 * @returns {*}
 */
export function GetAsync(url, data, headers) {
  return HttpRequest(url, "GET", data, headers);
}

/**
 * 同步方式调用POST
 * @param url       {string}    数据请求地址
 * @param data      {Object}    请求的数据
 * @param headers   {Object}    请求携带的Header信息
 * @returns {*}
 */
export function PostSync(url, data, headers) {
  return HttpRequest(url, "POST", data, headers, false);
}

/**
 * 异步方式调用POST，返回Promise
 * @param url       {string}    数据请求地址
 * @param data      {Object}    请求的数据
 * @param headers   {Object}    请求携带的Header信息
 * @returns {*}
 */
export function PostAsync(url, data, headers) {
  return HttpRequest(url, "POST", data, headers);
}

/**
 * 同步方式调用DELETE
 * @param url       {string}    数据请求地址
 * @param data      {Object}    请求的数据
 * @param headers   {Object}    请求携带的Header信息
 * @returns {*}
 */
export function DeleteSync(url, data, headers) {
  return HttpRequest(url, "DELETE", data, headers, false);
}

/**
 * 异步方式调用DELETE，返回Promise
 * @param url       {string}    数据请求地址
 * @param data      {Object}    请求的数据
 * @param headers   {Object}    请求携带的Header信息
 * @returns {*}
 */
export function DeleteAsync(url, data, headers) {
  return HttpRequest(url, "DELETE", data, headers);
}