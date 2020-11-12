import $http from './config';
import apiAddr,{FORMDATA} from './apiAddr';

const API = {};
// 锁定请求
const REQUEST_LOCK = {};

//判断是否是路径参数的url
function isPathParams(url) {
    return url.lastIndexOf('/') === url.length - 1;
}

function createFromData(params){
    const result = new FormData();
    for(const key in params){
        result.append(key,params[key]);
    }
    return result;
}


function isFormData(url){
    return url.includes(FORMDATA);
}

/**
 * 生成请求函数
 * @param {String} url
 */
function generatorApiFunc(url) {
    const arr = url.split(' ');
    let method ='';
    const bool = isFormData(url);
    if (arr.length  > 1) {
        method = arr[0];
        url = arr[1];
    }
    return (data = {},opt) => {
        // if (REQUEST_LOCK[url]) {
        //     console.warn('请求正在响应中，请勿重复点击！');
        //     return new Promise(() => {
        //     });
        // } else {
        return new Promise((resolve, reject) => {
            REQUEST_LOCK[url] = url;
            if (isPathParams(url)) {
                // /user/1 处理路径参数的情况 直接把参数添加在请求路径后面
                url += data;
                if(opt){
                    //处理路径参数 传formdata的情况
                    data = opt;
                }
            }
            $http({
                url,
                method,
                params: method === 'GET' ? data : {},
                data:bool ? createFromData(data) : data,
            }).then((res) => {
                if(res.code===200){
                    resolve(res.data);
                }else{
                    reject(res);
                }
            }).catch((err) => {
                console.warn(`请求错误----url:${url}`, method, data);
                console.error(err);
                reject(err);
            }).finally(() => {
                delete REQUEST_LOCK[url];
            });
        });
        // }
    };
}


for (const key in apiAddr) {
    API[key] = generatorApiFunc(apiAddr[key]);
}
export default API;