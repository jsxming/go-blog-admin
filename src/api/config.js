import axios from 'axios';
import store from '@/redux/persist';
// 删除请求参数中无效的参数
function deleteInvalidParams(params) {
    for (const key in params) {
        const value = params[key];
        if (typeof value === 'string' && !value.trim().length) {
            delete params[key];
        } else if (Array.isArray(value) && !value.length) {
            delete params[key];
        }
    }
    return params;
}

const errorCodeResolve = {
    401() {
        sessionStorage.removeItem('accessToken');
    },
    400() {
        //请求错误
        // Vue.prototype.$message.error(msg)
    },
};

const $http = axios.create({
    // baseURL: API_BASE_URL,
    baseURL: '/blog',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
    },
});

// 添加请求拦截器
$http.interceptors.request.use(
    (config) => {
        const { token } = store.getState();
        if (token && token !== '') {
            config.headers['token'] = token;
        }
        if (config.method === 'post') {
            config.data = deleteInvalidParams(config.data || {});
        } else {
            config.params = deleteInvalidParams(config.params || {});
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 添加响应拦截器
$http.interceptors.response.use(
    (response) => {
        if (response.data.code === 401) {
            errorCodeResolve[401]();
        }
        return response.data;
    },
    (error) => {
        const {
            msg,
            code,
        } = error.response.data;
        errorCodeResolve[code] && errorCodeResolve[code](msg);
        return Promise.reject(error.response.data);
    }
);


export default $http;