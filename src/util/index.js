// export './info'
export {showInfo} from './info';
export {isArray,isValidValue} from './validator';
export const TEST  ='test';




/**
 * 生成table column数据
 * @param {String} title
 * @param {String,Number} key
 */
export function createTableColumn(title,key){
    return {
        title,
        dataIndex:key,
        key
    };
}

export function createTableIndex(){
    return {
        ...createTableColumn('序号','id'),
        fixed:'left',
        align:'center',
        width:80,
        render:(row,v,index)=>{
            // console.log();
            return index+1;
        }

    };
}