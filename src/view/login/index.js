import React from 'react';
import { Form, Input, Button, Checkbox, } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import {useHistory,} from 'react-router-dom';
import './login.less';
import API from '@/api/index';
import { useDispatch } from 'react-redux';
import {SET_TOKEN,SET_USER} from '@/redux/action-type';
import {showInfo} from '@/util/index';
import { useForm } from 'antd/lib/form/Form';
import {isValidValue} from '@/util/validator';
// const theme = require('@/theme/index');
// theme.init();

const catchKey = 'loginFormvalues';
export default function Login() {
    const history = useHistory();
    const dispatch = useDispatch();
    const [loginformRef] = useForm();
    const val = localStorage.getItem(catchKey);
    if(isValidValue(val)){
        loginformRef.setFieldsValue(JSON.parse(val));
    }

    const submit = values => {
        if(values.remember){
            localStorage.setItem(catchKey,JSON.stringify({account:values.account,password:values.password}));
        }
        API.login(values).then((res) => {
            dispatch({type:SET_TOKEN,payload:res.token});
            dispatch({type:SET_USER,payload:res.user});
            API.queryUserAuth().then((res) => {
                console.log(res);
            }).catch((err) => {

            });
            history.push('/home');
        }).catch((e) => {
            showInfo(e.msg);

        });
    };

    return (
        <div
            className="flex_center"
            id="login"
        >
            <div className="form">
                <p className="title">登录</p>

                <div className="flex_center">
                    <Form
                        form={loginformRef}
                        name="basic"
                        onFinish={submit}
                        size="large"
                        style={{width:'100%'}}
                    >
                        <Form.Item
                            name="account"
                            rules={[{ required: true, message: '请输入账号!'}]}
                        >
                            <Input placeholder="账号" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: '请输入密码!'}]}
                        >
                            <Input.Password placeholder="密码" />
                        </Form.Item>

                        <Form.Item >
                            <Button className="icon_wrap"
                                htmlType="submit"
                                type="primary"
                            >
                                <ArrowRightOutlined style={{color:'#fff'}} />
                            </Button>
                        </Form.Item>
                        <Form.Item
                            className="flex_center"
                            name="remember"
                            valuePropName="checked"
                            wrapperCol={{offset: 0, span: 8}}
                        >
                            <Checkbox style={{color:'#ACBAD4'}}>记住密码</Checkbox>
                        </Form.Item>
                    </Form>
                </div>

            </div>
        </div>
    );
}