import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { extend } from 'lodash-es';

import { logPattern } from '~/utils';

const { env } = process;
const { NODE_ENV, REACT_APP_API } = env;
extend(axios.defaults, {
  baseURL: REACT_APP_API,
});

const debugLog = console.log;
const infoLog = console.info;
const warnLog = console.warn;
const errorLog = console.error;

const logConfig = (config: AxiosRequestConfig, logger = debugLog) => {
  const { url, method, data, params, headers, baseURL } = config;
  if (url) {
    logger('url:', url);
  }
  if (method) {
    logger('method:', method);
  }
  if (data) {
    logger('data:', data);
  }
  if (params) {
    logger('params:', params);
  }
  if (headers) {
    logger('headers:', headers);
  }
  if (baseURL) {
    logger('baseURL:', baseURL);
  }
};

const logResponse = (response: AxiosResponse, logger = debugLog) => {
  const { status, statusText, data, headers } = response;
  if (status) {
    logger('status:', status);
  }
  if (statusText) {
    logger('statusText:', statusText);
  }
  if (data) {
    logger('data:', data);
  }
  if (headers) {
    logger('headers:', headers);
  }
};

const logError = (error: AxiosError) => {
  const { name, message } = error;
  if (name) {
    errorLog('name:', name);
  }
  if (message) {
    errorLog('message:', message);
  }
};

const getConfigLog = ({ method, url, baseURL }: AxiosRequestConfig) => {
  if (method && url && baseURL) {
    return `${ method.toUpperCase() } ${ url.replace(baseURL, '') }`;
  } else {
    return '';
  }
};

axios.interceptors.request.use(config => {
  const log = `[debug] ${ getConfigLog(config) }`;
  if (logPattern.test(log)) {
    console.groupCollapsed(log);
    logConfig(config);
    console.groupEnd();
  }
  return config;
}, error => {
  const { config } = error;
  const log = `[fatal] ${ getConfigLog(config) }`;
  if (logPattern.test(log)) {
    console.group(log);
    debugLog(error);
    console.groupEnd();
  }
  return Promise.reject(error);
});

axios.interceptors.response.use(response => {
  const { config } = response;
  const log = `[info] ${ getConfigLog(config) }`;
  if (logPattern.test(log)) {
    console.groupCollapsed(log);
    logResponse(response, infoLog);
      // config
      console.groupCollapsed('config');
      logConfig(response.config, infoLog);
      console.groupEnd();
    console.groupEnd();
  }
  return response;
}, error => {
  const { config } = error;
  const log = `[error] ${ getConfigLog(config) }`;
  if (logPattern.test(log)) {
    console.group(log);
    logError(error);
      // response
      if (error.response) {
        console.group('response');
        logResponse(error.response, errorLog);
        console.groupEnd();
      }
      // config
      console.groupCollapsed('config');
      logConfig(error.config, errorLog);
      console.groupEnd();
    console.groupEnd();
  }
  return Promise.reject(error);
});
