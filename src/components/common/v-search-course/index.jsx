import React from 'react';
import {Cascader} from 'antd';
import {connect} from 'react-redux';
import {QUERY_COURSE} from '@/redux/action-type';
import {isArray} from '@/util/validator';
import { useEffect } from 'react';



//课程筛选组件
/**
 *
 * @param {Boolean} isSearch 区分查询与form组件
 */
function VSearchCourse({onChange,data,queryCourse,isSearch=true}){

    useEffect(()=>{
        if(!isArray(data)){
            queryCourse();
            // console.log(data,'data');
        }
    },[]);
    const Sect = <Cascader fieldNames={{ label: 'name', value: 'id', children: 'children' }}
        onChange={onChange}
        options={data} />;
    const Result = isSearch ? <div className="flex_start form_item">
        <span className="label">科目</span>
        {Sect}
    </div> : Sect;
    return Result;
}

function mapDispatchToProps(dispatch){
    return {
        queryCourse(){
            dispatch({type:QUERY_COURSE});
        },
    };
}

function mapStateToProps(state){
    return {
        data:state.courseList,
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(VSearchCourse);