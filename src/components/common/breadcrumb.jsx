import React from 'react';
import { Breadcrumb } from 'antd';
import {RightOutlined} from '@ant-design/icons';

//题目编辑
function Bread({data}){
    return (
        <Breadcrumb
            className="flex_start"
            separator={<RightOutlined />}
        >
            {
                data.map(item=>{
                    return <Breadcrumb.Item key={item.title}>{item.title}</Breadcrumb.Item>;
                })
            }
        </Breadcrumb>
    );
}

export default Bread;
