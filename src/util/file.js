const IMG_TYPE = ['png', 'jpg', 'jpeg', 'gif'];
const EXCEL_TYPE = ['xlsx','xls'];

/**
 * 判断文件是否是图片类型
 * @param {String} val
 */
export function isImg(val) {
    return IMG_TYPE.includes(val);
}

export function isExcel(val){
    return EXCEL_TYPE.includes(val);
}

//获取文件后缀
export function getFileSuffix(name){
    const i = name.lastIndexOf('.');
    return name.slice(i+1);
}

export function fileChange(e){
    const file = e.target.files[0];
    return file;
}