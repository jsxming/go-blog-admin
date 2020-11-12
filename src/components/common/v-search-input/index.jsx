import React from 'react';
import {SearchOutlined} from '@ant-design/icons';
import {Input} from 'antd';
import './index.less';
import { useState } from 'react';

export default ({submit,placeholder,value})=>{
    const [val,setValue] = useState('');
    return (
        <div className="flex_start search_wrap"
            style={{position:'relative'}}>
            <Input.Search
                defaultValue={value}
                enterButton={<SearchOutlined onClick={()=>{
                    submit(val);
                }}
                />}
                onSearch={(v)=>{
                    setValue(v);
                    submit(v);
                }}
                placeholder={placeholder}
            />
        </div>
    );
};