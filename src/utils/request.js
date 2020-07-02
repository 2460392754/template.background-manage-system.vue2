import axios from 'axios';
import Qs from 'qs';
import { Message } from 'element-ui';
import store from '@/store';
import { getToken } from '@/utils/auth';

// create an axios instance
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    timeout: 1000 * 15
});

// request interceptor
service.interceptors.request.use(
    (config) => {
        // 传输格式是'x-www-form-urlencoded'格式时进行转json字符串
        if (
            config.method !== 'get' &&
            config.headers['Content-Type'] === 'application/x-www-form-urlencoded'
        ) {
            config.data = Qs.stringify(config.data);
        }

        if (store.getters.token) {
            config.headers.Authorization = 'Bearer ' + getToken();
        }
        return config;
    },
    (error) => {
        // do something with request error
        console.log(error); // for debug
        return Promise.reject(error);
    }
);

// response interceptor
service.interceptors.response.use(
    (response) => {
        return handleHttpStatus(response.status)
            .then(() => {
                const data = response.data;

                if (data.status === false) {
                    return Promise.reject(data.message || 'Error');
                } else {
                    return data.data;
                }
            })
            .catch((errMsg) => {
                Message({
                    message: errMsg,
                    type: 'error',
                    duration: 5 * 1000
                });

                return Promise.reject(new Error(errMsg));
            });
    },
    (error) => {
        console.log('err' + error); // for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        });

        return Promise.reject(error);
    }
);

/**
 * 处理 http 状态码
 * @param {object} data 请求返回的数据
 * @param {string | number} status http状态码
 * @return {never}
 */
const handleHttpStatus = function (status) {
    let msg = '';

    switch (status) {
        case 200:
        case 201:
            return Promise.resolve();

        case 400:
            msg = '请求错误';
            break;

        case 401:
            // Store.dispatch('user/logout');
            msg = '登录过期, 请重新登录';
            break;

        case 403:
            // Store.dispatch('user/logout');
            msg = '拒绝请求, 当前操作没有被授权(权限)';
            break;

        case 404:
            msg = '请求路径不存在';
            break;

        case 500:
            msg = '服务器错误';
            break;

        case 504:
            msg = '网络代理错误';
            break;

        default:
            msg = '出现未知错误';
            break;
    }

    return Promise.reject(msg);
};

export default service;
