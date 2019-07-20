import {ToPromise} from "./utils";

export const Token = {token: ""};

/**
 * 数据请求
 * @param url       {string}    数据请求地址
 * @param data      {Object}    请求的数据
 * @param headers   {Object}    请求携带的Header信息
 * @param method    {string}    数据请求Method方式
 * @param async     {boolean}   是否异步请求
 * @returns {*}
 * @constructor
 */
export function HttpRequest(url, data, headers = {}, method, async = true) {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url, async);
  xhr.setRequestHeader('content-type', 'application/json');
  let header;
  for (header in headers) {
    xhr.setRequestHeader(header, headers[header]);
  }
  if (Token.token) {
    xhr.setRequestHeader("token", Token.token);
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
  return HttpRequest(url, data, headers, "GET", false);
}

/**
 * 异步方式调用GET，返回Promise
 * @param url       {string}    数据请求地址
 * @param data      {Object}    请求的数据
 * @param headers   {Object}    请求携带的Header信息
 * @returns {*}
 */
export function GetAsync(url, data, headers) {
  return HttpRequest(url, data, headers, "GET");
}

/**
 * 同步方式调用POST
 * @param url       {string}    数据请求地址
 * @param data      {Object}    请求的数据
 * @param headers   {Object}    请求携带的Header信息
 * @returns {*}
 */
export function PostSync(url, data, headers) {
  return HttpRequest(url, data, headers, "POST", false);
}

/**
 * 异步方式调用POST，返回Promise
 * @param url       {string}    数据请求地址
 * @param data      {Object}    请求的数据
 * @param headers   {Object}    请求携带的Header信息
 * @returns {*}
 */
export function PostAsync(url, data, headers) {
  return HttpRequest(url, data, headers, "POST");
}

/**
 * 同步方式调用DELETE
 * @param url       {string}    数据请求地址
 * @param data      {Object}    请求的数据
 * @param headers   {Object}    请求携带的Header信息
 * @returns {*}
 */
export function DeleteSync(url, data, headers) {
  return HttpRequest(url, data, headers, "DELETE", false);
}

/**
 * 异步方式调用DELETE，返回Promise
 * @param url       {string}    数据请求地址
 * @param data      {Object}    请求的数据
 * @param headers   {Object}    请求携带的Header信息
 * @returns {*}
 */
export function DeleteAsync(url, data, headers) {
  return HttpRequest(url, data, headers, "DELETE");
}