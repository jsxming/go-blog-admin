/**
 * 判断是否是一个有内容的数组
 * @param {any} val
 */
export function isArray(val){
    return Array.isArray(val) && val.length > 0;
}


/**
 * 判断一个值是否是一个有效的值
 * @param {any} val
 */
export function isValidValue(val){
    const r = val!==null && typeof val !=='undefined';
    return r;
}